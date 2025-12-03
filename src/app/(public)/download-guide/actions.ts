'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const leadSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5, "Phone number is required"),
    country: z.string().min(2, "Country is required"),
    study_interest: z.string().min(2, "Study interest is required"),
});

export async function submitLead(formData: FormData) {
    const supabase = await createClient();
    const source = formData.get("source") as string || "guide_download";

    let rawData: any = {};

    if (source === "contact_us") {
        rawData = {
            name: `${formData.get("firstName")} ${formData.get("lastName")}`,
            email: formData.get("email"),
            phone: formData.get("phone"),
            message: `[Subject: ${formData.get("subject")}] ${formData.get("message")}`,
            source: "contact_us",
            status: "new"
        };
    } else {
        rawData = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            country: formData.get("country"),
            study_interest: formData.get("study_interest"),
            source: "guide_download",
            status: "new"
        };
    }

    // Basic validation
    if (!rawData.name || !rawData.email) {
        return { error: "Name and email are required" };
    }

    const { data: lead, error } = await supabase
        .from("leads")
        .insert([rawData])
        .select()
        .single();

    if (error) {
        console.error("Error saving lead:", error);
        return { error: "Failed to save your information. Please try again." };
    }

    // Only send guide if source is guide_download
    let guideUrl = null;
    if (source === "guide_download") {
        // Fetch guide URL from settings
        const { data: settings } = await supabase
            .from("settings")
            .select("value")
            .eq("key", "guide_download_url")
            .single();

        guideUrl = settings?.value || "https://example.com/guide.pdf";

        // Simulate sending email (In a real app, use Resend or similar)
        console.log(`[Email Mock] Sending guide (${guideUrl}) to ${rawData.email}`);
    }

    // Simulate admin notification
    console.log(`[Admin Alert] New lead from ${source}: ${rawData.name}`);

    revalidatePath("/admin/leads");
    revalidatePath("/admin"); // Update sidebar counts

    return {
        success: true,
        message: source === "guide_download" ? "Guide sent to your email!" : "Message sent successfully!",
        guideUrl: guideUrl
    };
}
