"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "Email is required" };
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from("leads")
        .insert({
            email,
            source: "newsletter",
            status: "new",
            name: "Newsletter Subscriber",
            created_at: new Date().toISOString()
        });

    if (error) {
        console.error("Newsletter subscription error:", error);
        return { error: "Failed to subscribe. Please try again." };
    }

    return { success: true };
}
