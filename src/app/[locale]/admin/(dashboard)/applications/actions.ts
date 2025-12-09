"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { PORTAL_KEY } from "@/lib/constants/portal";

export async function getApplications() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("applications")
        .select(`
            *,
            university_program:university_program_id (
                id,
                tuition_fee,
                program_catalog:program_catalog_id (
                    title,
                    level
                ),
                university:university_id (
                    name,
                    logo_url,
                    city
                )
            )
        `)
        .eq("portal_key", PORTAL_KEY)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching applications:", error);
        throw new Error(error.message);
    }
    console.log("Fetched applications:", data?.length);
    return data;
}

export async function updateApplicationStatus(id: string, status: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", id);

    if (error) return { error: error.message };

    // Get application details for email
    const { data: appData } = await supabase
        .from("applications")
        .select(`
            student_id, 
            student_email, 
            student_name,
            university_program:university_program_id (
                program_catalog:program_catalog_id (title)
            ),
            status
        `)
        .eq("id", id)
        .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const app = appData as any; // Safe cast for joined data

    const apiKey = process.env.RESEND_API_KEY || '';
    const maskedKey = apiKey ? `${apiKey.substring(0, 5)}...` : 'MISSING';
    let emailResult = { success: false, error: null as string | null };

    // Send status update email
    if (app) {
        try {
            const { sendStatusChangedEmail } = await import('@/lib/email/service');
            const result = await sendStatusChangedEmail({
                studentId: app.student_id,
                studentEmail: app.student_email,
                studentName: app.student_name,
                programTitle: app.university_program?.program_catalog?.title || 'Program',
                oldStatus: 'Application',
                newStatus: status,
                applicationId: id
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            emailResult = result as any;
        } catch (e) {
            console.error('Error sending status email:', e);
            emailResult.error = `${(e as Error).message} [Key: ${maskedKey}]`;
        }
    }

    revalidatePath("/admin/applications");
    return { success: true, emailSent: emailResult.success, emailError: emailResult.error };
}

export async function addAdminNote(id: string, note: string) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // Update admin_notes field
    const { error } = await supabase
        .from("applications")
        .update({
            admin_notes: note,
            updated_at: new Date().toISOString()
        })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/applications");
    return { success: true };
}

export async function sendMessageToStudent(
    applicationId: string,
    subject: string,
    message: string,
    messageType: string = 'general',
    requiresAction: boolean = false,
    skipEmail: boolean = false
) {
    const supabase = await createClient();

    // Get current user (admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // Get application details for email
    const { data: application, error: appError } = await supabase
        .from("applications")
        .select("student_id, student_email, student_name")
        .eq("id", applicationId)
        .single();

    if (appError) return { error: appError.message };

    // Create message in database
    const { data: messageData, error: messageError } = await supabase
        .from("application_messages")
        .insert({
            application_id: applicationId,
            sender_id: user.id,
            sender_type: 'admin',
            message_type: messageType,
            subject: subject,
            message: message,
            requires_action: requiresAction,
            email_sent: false
        })
        .select()
        .single();

    if (messageError) return { error: messageError.message };

    // Send email notification (will be logged to email_notifications table)
    if (!skipEmail) {
        try {
            // Dynamic import to avoid build issues if email service isn't fully set up
            const { sendMessageReceivedEmail } = await import('@/lib/email/service');
            await sendMessageReceivedEmail({
                studentId: application.student_id,
                studentEmail: application.student_email,
                studentName: application.student_name,
                subject: subject,
                message: message,
                applicationId: applicationId,
                messageId: messageData.id,
                requiresAction: requiresAction
            });

            // Update message to mark email as sent
            await supabase
                .from("application_messages")
                .update({
                    email_sent: true,
                    email_sent_at: new Date().toISOString()
                })
                .eq("id", messageData.id);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            // Don't fail the whole operation if email fails
        }
    }

    revalidatePath("/admin/applications");
    return { success: true, messageId: messageData.id };
}

/**
 * Request payment from student
 */
export async function requestPayment(
    applicationId: string,
    amount: number,
    currency: string = 'USD',
    description: string
) {
    const supabase = await createClient();

    // Get current user (admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // 1. Update application table (for Admin UI compatibility)
    const { error: updateError } = await supabase
        .from("applications")
        .update({
            status: 'pending_payment',
            payment_amount: amount,
            payment_currency: currency,
            payment_status: 'pending'
        })
        .eq("id", applicationId);

    if (updateError) return { error: updateError.message };

    // 2. Insert into payment_transactions (for Student Dashboard compatibility)
    // First get student details
    const { data: app } = await supabase
        .from("applications")
        .select("student_id, student_email, student_name")
        .eq("id", applicationId)
        .single();

    if (!app?.student_id) {
        console.error('Application missing student_id:', applicationId);
        // If student_id is missing, we can't create the transaction due to NOT NULL constraint
        // But we can try to proceed if the schema allows it, but user said it's NOT NULL.
        // Let's return an error for now.
        return { error: "Cannot create payment request: Application is not linked to a student account (missing student_id)" };
    }

    const { error: insertError } = await supabase.from("payment_transactions").insert({
        application_id: applicationId,
        student_id: app.student_id,
        amount: amount,
        currency: currency,
        payment_type: 'application_fee', // Correct column name
        status: 'pending' as string // Explicitly cast to string to match check constraint
        // description column does not exist in the schema provided
    });

    if (insertError) {
        console.error('Failed to insert payment transaction:', insertError);
        return { error: `Failed to create payment transaction: ${insertError.message}` };
    }

    // 3. Send message to student (and specialized email)
    const message = `Payment Request\n\nAmount: ${currency} ${amount}\n\nDescription: ${description}\n\nPlease complete the payment to proceed with your application.`;

    // Send specialized email
    try {
        const { sendPaymentRequestedEmail } = await import('@/lib/email/service');
        await sendPaymentRequestedEmail({
            studentId: app.student_id,
            studentEmail: app.student_email,
            studentName: app.student_name,
            amount,
            currency,
            paymentType: 'Application Fee',
            paymentLink: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/applications/${applicationId}`,
            deadline: 'Immediate', // Or handle specific deadline
            paymentId: undefined
        });
    } catch (e) {
        console.error("Error sending payment email:", e);
    }

    await sendMessageToStudent(
        applicationId,
        'Payment Request',
        message,
        'payment_request',
        true,
        true // Skip generic email
    );

    revalidatePath("/admin/applications");
    return { success: true };
}

/**
 * Request documents from student
 */
export async function requestDocuments(
    applicationId: string,
    documents: string[],
    additionalInstructions?: string
) {
    const supabase = await createClient();

    // Get current user (admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // 1. Update application table (for Admin UI compatibility)
    const { error: updateError } = await supabase
        .from("applications")
        .update({
            status: 'pending_documents',
            documents_complete: false,
            requested_documents: documents  // Store the list
        })
        .eq("id", applicationId);

    if (updateError) return { error: updateError.message };

    // 2. Insert into document_requests (for Student Dashboard compatibility)
    // Insert each document as a request
    const requests = documents.map(doc => ({
        application_id: applicationId,
        document_name: doc,
        document_type: doc, // Using document name as type for now
        status: 'pending' as string, // Explicitly cast to string to match check constraint
        description: additionalInstructions
    }));

    const { error: insertError } = await supabase.from("document_requests").insert(requests);

    if (insertError) {
        console.error('Failed to insert document requests:', insertError);
        return { error: `Failed to create document requests: ${insertError.message}` };
    }

    // 3. Create message (and send specialized email)
    const documentList = documents.map((doc, i) => `${i + 1}. ${doc}`).join('\n');
    const message = `Document Request\n\nPlease upload the following documents:\n\n${documentList}${additionalInstructions ? '\n\nAdditional Instructions:\n' + additionalInstructions : ''}`;

    // Get student details for email
    const { data: app } = await supabase
        .from("applications")
        .select("student_id, student_email, student_name")
        .eq("id", applicationId)
        .single();

    if (app) {
        try {
            const { sendDocumentRequestedEmail } = await import('@/lib/email/service');
            // Send email for first document (simplified for now, or could combine)
            // Ideally we'd have a 'sendDocumentsRequestedEmail' (plural), but singular works for notification content
            await sendDocumentRequestedEmail({
                studentId: app.student_id,
                studentEmail: app.student_email,
                studentName: app.student_name,
                documentName: documents.join(', '), // List them
                description: additionalInstructions || 'Please upload the requested documents via your dashboard.',
                deadline: 'ASAP',
                applicationId: applicationId
            });
        } catch (e) {
            console.error("Error sending document email:", e);
        }
    }

    await sendMessageToStudent(
        applicationId,
        'Document Request',
        message,
        'document_request',
        true,
        true // Skip generic email
    );

    revalidatePath("/admin/applications");
    return { success: true };
}

/**
 * Upload conditional acceptance letter
 */
export async function uploadConditionalLetter(
    applicationId: string,
    formData: FormData
) {
    const supabase = await createClient();

    // Get current user (admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const file = formData.get('file') as File;
    if (!file) return { error: "No file provided" };

    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${applicationId}/conditional_letter_${Date.now()}.${fileExt}`;
    const filePath = `acceptance-letters/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

    if (uploadError) return { error: uploadError.message };

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

    // 1. Update application table (for Admin UI compatibility)
    const { error: updateError } = await supabase
        .from("applications")
        .update({
            status: 'accepted',
            acceptance_letter_url: publicUrl
        })
        .eq("id", applicationId);

    if (updateError) return { error: updateError.message };

    const { data: appData } = await supabase
        .from("applications")
        .select(`
            student_id, 
            student_email, 
            student_name,
            university_program:university_program_id (
                program_catalog:program_catalog_id (title),
                university:university_id (name)
            )
        `)
        .eq("id", applicationId)
        .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const app = appData as any; // Bypass TS inference for deep joins

    if (app) {
        // Check if table exists first or just try insert and ignore error? 
        // Better to rely on the column update we just did as primary source for now.
        // But let's try to insert if we can to keep data clean.
        try {
            await supabase.from("acceptance_letters").insert({
                student_id: app.student_id,
                application_id: applicationId,
                letter_url: publicUrl,
                issued_at: new Date().toISOString()
            });
        } catch (e) {
            // Ignore if table doesn't exist or other error, as column update is primary
            console.log("Could not insert into acceptance_letters table", e);
        }

        // Send specialized email
        try {
            const { sendAcceptanceLetterEmail } = await import('@/lib/email/service');
            await sendAcceptanceLetterEmail({
                studentId: app.student_id,
                studentEmail: app.student_email,
                studentName: app.student_name,
                programTitle: app.university_program?.program_catalog?.title || 'Program',
                universityName: app.university_program?.university?.name || 'University',
                letterNumber: `AL-${applicationId.slice(0, 8).toUpperCase()}`, // Generate or use real if exists
                letterUrl: publicUrl,
                applicationId: applicationId
            });
        } catch (e) {
            console.error("Error sending acceptance email:", e);
        }
    }

    // 3. Send message to student
    const message = `Congratulations! Your application has been conditionally accepted.\n\nYou can download your conditional acceptance letter here:\n${publicUrl}\n\nPlease review the letter carefully and follow any instructions provided.`;

    await sendMessageToStudent(
        applicationId,
        'Conditional Acceptance Letter',
        message,
        'acceptance_letter',
        false,
        true // Skip generic email
    );

    revalidatePath("/admin/applications");
    return { success: true, fileUrl: publicUrl };
}

/**
 * Verify a payment transaction
 */
export async function verifyPayment(transactionId: string) {
    const supabase = await createClient();

    // Get current user (admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: transaction, error } = await supabase
        .from('payment_transactions')
        .update({
            status: 'completed',
            updated_at: new Date().toISOString()
        })
        .eq('id', transactionId)
        .select('application_id')
        .single();

    if (error) {
        console.error('Failed to verify payment:', error);
        return { error: error.message };
    }

    // Update application status
    if (transaction?.application_id) {
        // Check if there are any pending or rejected document requests
        const { count } = await supabase
            .from('document_requests')
            .select('*', { count: 'exact', head: true })
            .eq('application_id', transaction.application_id)
            .in('status', ['pending', 'rejected']);

        // If no pending/rejected documents (count === 0), mark as submitted
        // Otherwise, mark as pending_documents
        const newStatus = count === 0 ? 'submitted' : 'pending_documents';

        await supabase
            .from('applications')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', transaction.application_id);
    }

    revalidatePath("/admin/applications");
    revalidatePath("/dashboard/applications"); // Update student view
    return { success: true };
}

/**
 * Approve a document
 */
export async function approveDocument(requestId: string) {
    const supabase = await createClient();

    // Get current user (admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: docRequest, error } = await supabase
        .from('document_requests')
        .update({
            status: 'approved',
            updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select('application_id')
        .single();

    if (error) {
        console.error('Failed to approve document:', error);
        return { error: error.message };
    }

    // Check if all documents are approved or submitted
    if (docRequest?.application_id) {
        const { count } = await supabase
            .from('document_requests')
            .select('*', { count: 'exact', head: true })
            .eq('application_id', docRequest.application_id)
            .in('status', ['pending', 'rejected']);

        // If no pending/rejected documents, mark as submitted (or under_review if all approved)
        if (count === 0) {
            await supabase
                .from('applications')
                .update({
                    status: 'submitted',
                    documents_complete: true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', docRequest.application_id);
        }
    }

    revalidatePath("/admin/applications");
    revalidatePath("/dashboard/applications"); // Update student view
    return { success: true };
}

/**
 * Reject a payment transaction
 */
export async function rejectPayment(transactionId: string) {
    const supabase = await createClient();

    // Get current user (admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: transaction, error } = await supabase
        .from('payment_transactions')
        .update({
            status: 'rejected',
            updated_at: new Date().toISOString()
        })
        .eq('id', transactionId)
        .select('application_id')
        .single();

    if (error) {
        console.error('Failed to reject payment:', error);
        return { error: error.message };
    }

    // Update application status back to pending_payment
    if (transaction?.application_id) {
        await supabase
            .from('applications')
            .update({
                status: 'pending_payment',
                updated_at: new Date().toISOString()
            })
            .eq('id', transaction.application_id);
    }

    revalidatePath("/admin/applications");
    revalidatePath("/dashboard/applications"); // Update student view
    return { success: true };
}

/**
 * Reject a document
 */
export async function rejectDocument(requestId: string) {
    const supabase = await createClient();

    // Get current user (admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: docRequest, error } = await supabase
        .from('document_requests')
        .update({
            status: 'rejected',
            updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select('application_id')
        .single();

    if (error) {
        console.error('Failed to reject document:', error);
        return { error: error.message };
    }

    // Update application status back to pending_documents
    if (docRequest?.application_id) {
        await supabase
            .from('applications')
            .update({
                status: 'pending_documents',
                documents_complete: false,
                updated_at: new Date().toISOString()
            })
            .eq('id', docRequest.application_id);
    }

    revalidatePath("/admin/applications");
    revalidatePath("/dashboard/applications"); // Update student view
    return { success: true };
}
