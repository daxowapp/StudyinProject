'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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

    revalidatePath('/dashboard/messages');
    revalidatePath('/dashboard');
    return { success: true };
}

export async function markAllMessagesAsRead(applicationIds: string[]) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('application_messages')
        .update({
            is_read: true,
            read_at: new Date().toISOString()
        })
        .in('application_id', applicationIds)
        .eq('is_read', false);

    if (error) return { error: error.message };

    revalidatePath('/dashboard/messages');
    revalidatePath('/dashboard');
    return { success: true };
}

export async function sendReply(formData: FormData) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const applicationId = formData.get('applicationId') as string;
    const message = formData.get('message') as string;


    // Verify student owns this application
    const { data: application, error: appError } = await supabase
        .from('applications')
        .select('id, student_email, student_name')
        .eq('id', applicationId)
        .eq('student_id', user.id)
        .single();

    if (appError || !application) {
        return { error: 'Application not found or access denied' };
    }

    // Create reply message
    const { data: replyMessage, error: messageError } = await supabase
        .from('application_messages')
        .insert({
            application_id: applicationId,
            sender_id: user.id,
            sender_type: 'student',
            message_type: 'reply',
            subject: 'Re: Student Reply',
            message: message,
            requires_action: false,
            is_read: false,
            parent_message_id: formData.get('originalMessageId') as string || null
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
                continue; // Skip this file but continue with others
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath);

            // Save attachment record
            await supabase
                .from('message_attachments')
                .insert({
                    message_id: replyMessage.id,
                    file_name: file.name,
                    file_url: publicUrl,
                    file_size: file.size,
                    file_type: fileExt,
                    mime_type: file.type,
                    uploaded_by: user.id
                });
        }
    }

    // Send email notification to admin
    try {
        const { sendAdminNewMessageEmail } = await import('@/lib/email/service');
        await sendAdminNewMessageEmail({
            studentName: application.student_name || 'Student',
            message: message,
            applicationId: applicationId,
            messageId: replyMessage.id
        });
    } catch (emailError) {
        console.error('Error sending email:', emailError);
    }

    revalidatePath('/dashboard/messages');
    revalidatePath('/admin/applications');
    return { success: true, messageId: replyMessage.id };
}
