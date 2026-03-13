'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendContactConfirmationEmail, sendAdminContactNotificationEmail } from "@/lib/email/service";

export async function submitLead(formData: FormData) {
    const supabase = await createClient();
    const source = formData.get("source") as string || "guide_download";

    let rawData: Record<string, unknown> = {};

    // Store individual fields for email sending
    const firstName = formData.get("firstName") as string || '';
    const lastName = formData.get("lastName") as string || '';
    const email = formData.get("email") as string || '';
    const phone = formData.get("phone") as string || '';
    const subject = formData.get("subject") as string || 'General';
    const message = formData.get("message") as string || '';

    if (source === "contact_us") {
        rawData = {
            name: `${firstName} ${lastName}`.trim(),
            email: email,
            phone: phone,
            message: `[Subject: ${subject}] ${message}`,
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

    const { error } = await supabase
        .from("leads")
        .insert([rawData])
        .select()
        .single();

    if (error) {
        console.error("Error saving lead:", error);
        return { error: "Failed to save your information. Please try again." };
    }

    // Send emails for contact form submissions
    if (source === "contact_us") {
        const clientName = `${firstName} ${lastName}`.trim();
        const subjectLabel = subject.charAt(0).toUpperCase() + subject.slice(1).replace('_', ' ');

        // Send confirmation to client + notification to admin (in parallel, non-blocking)
        try {
            await Promise.all([
                sendContactConfirmationEmail({
                    clientEmail: email,
                    clientName: clientName,
                    subject: subjectLabel,
                }),
                sendAdminContactNotificationEmail({
                    name: clientName,
                    email: email,
                    phone: phone,
                    subject: subjectLabel,
                    message: message,
                }),
            ]);
            console.log(`[Email] Contact form emails sent for ${clientName}`);
        } catch (emailError) {
            // Don't fail the form submission if email fails — lead is already saved
            console.error('[Email] Failed to send contact form emails:', emailError);
        }
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

    revalidatePath("/admin/leads");
    revalidatePath("/admin"); // Update sidebar counts

    return {
        success: true,
        message: source === "guide_download" ? "Guide sent to your email!" : "Message sent successfully!",
        guideUrl: guideUrl
    };
}
