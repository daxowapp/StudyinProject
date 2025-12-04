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
    }).select().single();

    if (error) {
        console.error("Application submission error:", error);
        return { error: error.message };
    }

    return { applicationId: data.id };
}
