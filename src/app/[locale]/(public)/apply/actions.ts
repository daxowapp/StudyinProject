'use server';

import { createClient } from '@/lib/supabase/server';
import { sendApplicationSubmittedEmail, sendAdminNewApplicationEmail } from '@/lib/email/service';

/**
 * Server action to send email notifications after a successful application submission.
 * Called from ApplyForm (client component) after the RPC submit_application succeeds.
 */
export async function sendApplicationEmails(data: {
    applicationId: string;
    studentName: string;
    programTitle: string;
    universityName: string;
}) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    try {
        // 1. Send confirmation email to student
        await sendApplicationSubmittedEmail({
            studentId: user.id,
            studentEmail: user.email!,
            studentName: data.studentName,
            programTitle: data.programTitle,
            universityName: data.universityName,
            applicationId: data.applicationId,
        });

        // 2. Send notification email to admin (Kenza + CC Ahmed)
        await sendAdminNewApplicationEmail({
            studentName: data.studentName,
            programTitle: data.programTitle,
            applicationId: data.applicationId,
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to send application emails:', error);
        return { error: (error as Error).message };
    }
}
