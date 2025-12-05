"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitApplication(formData: FormData) {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    const programId = formData.get("programId") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const passportNumber = formData.get("passportNumber") as string;

    // In a real app, we would handle file uploads here
    // For now, we'll just store mock URLs or skip file handling in this MVP step

    const { data, error } = await supabase.from("applications").insert({
        user_id: user.id,
        program_id: programId,
        status: "submitted",
        payment_status: "pending", // In real flow, this would be 'pending' until Stripe callback
        personal_info: {
            first_name: firstName,
            last_name: lastName,
            passport_number: passportNumber
        },
        documents: {} // Placeholder
    }).select(`
        *,
        university_program:program_id (
            id,
            program_catalog:program_catalog_id (
                title
            ),
            university:university_id (
                name
            )
        )
    `).single();

    if (error) {
        console.error("Application submission error:", error);
        return { error: error.message };
    }

    // Send emails
    try {
        const { sendApplicationSubmittedEmail, sendAdminNewApplicationEmail } = await import('@/lib/email/service');

        // 1. To Student
        await sendApplicationSubmittedEmail({
            studentId: user.id,
            studentEmail: user.email!, // Assumed present if auth passed
            studentName: `${firstName} ${lastName}`,
            programTitle: data.university_program?.program_catalog?.title || 'Program',
            universityName: data.university_program?.university?.name || 'University',
            applicationId: data.id
        });

        // 2. To Admin
        await sendAdminNewApplicationEmail({
            studentName: `${firstName} ${lastName}`,
            programTitle: data.university_program?.program_catalog?.title || 'Program',
            applicationId: data.id
        });

    } catch (e) {
        console.error("Failed to send submission emails:", e);
        // Don't fail the request, just log
    }

    return { applicationId: data.id };
}
