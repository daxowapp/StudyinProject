"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function updateApplicationStatus(id: string, status: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/applications");
    return { success: true };
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
    requiresAction: boolean = false
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

    revalidatePath("/admin/applications");
    return { success: true, messageId: messageData.id };
}
