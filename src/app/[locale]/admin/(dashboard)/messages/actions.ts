'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function sendAdminReply(
    applicationId: string,
    subject: string,
    message: string,
    messageType: string = 'general',
    requiresAction: boolean = false,
    parentMessageId: string | null = null
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
            email_sent: false,
            parent_message_id: parentMessageId
        })
        .select()
        .single();

    if (messageError) return { error: messageError.message };

    // Send email notification
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

    revalidatePath("/admin/messages");
    revalidatePath("/admin/applications");
    return { success: true, messageId: messageData.id };
}

export async function sendAdminReplyWithAttachments(formData: FormData) {
    const supabase = await createClient();

    // Get current user (admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const applicationId = formData.get('applicationId') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const messageType = formData.get('messageType') as string;
    const requiresAction = formData.get('requiresAction') === 'true';
    const parentMessageId = formData.get('parentMessageId') as string || null;

    // Get application details
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
            email_sent: false,
            parent_message_id: parentMessageId
        })
        .select()
        .single();

    if (messageError) return { error: messageError.message };

    // Handle file uploads
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
        if (key.startsWith('file_') && value instanceof File) {
            files.push(value);
        }
    }

    if (files.length > 0) {
        // Use admin client to insert into message_attachments if RLS prevents it, 
        // but usually admin user has access. 
        // If createAdminClient is not available, use regular client if RLS allows.
        // Assuming createAdminClient is available in @/lib/supabase/server based on user code.
        let adminClient = supabase;
        try {
            const { createAdminClient } = await import('@/lib/supabase/server');
            adminClient = await createAdminClient();
        } catch (error) {
            console.log("createAdminClient not found, using regular client", error);
        }

        for (const file of files) {
            // Upload file to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `message-attachments/${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);

            if (uploadError) {
                console.error('File upload error:', uploadError);
                continue;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath);

            // Save attachment record
            await adminClient
                .from('message_attachments')
                .insert({
                    message_id: messageData.id,
                    file_name: file.name,
                    file_url: publicUrl,
                    file_size: file.size,
                    file_type: fileExt,
                    mime_type: file.type,
                    uploaded_by: user.id
                });
        }
    }

    // Send email notification
    try {
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

        await supabase
            .from("application_messages")
            .update({
                email_sent: true,
                email_sent_at: new Date().toISOString()
            })
            .eq("id", messageData.id);
    } catch (emailError) {
        console.error("Error sending email:", emailError);
    }

    revalidatePath("/admin/messages");
    revalidatePath(`/admin/messages/${applicationId}`);
    return { success: true, messageId: messageData.id };
}

export async function markMessageAsRead(messageId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('application_messages')
        .update({
            is_read: true,
            read_at: new Date().toISOString()
        })
        .eq('id', messageId);

    if (error) return { error: error.message };

    revalidatePath('/admin/messages');
    return { success: true };
}
