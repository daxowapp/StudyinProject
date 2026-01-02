"use server";

export async function subscribeToNewsletter(formData: FormData) {
    // Mock implementation
    console.log("Subscribing to newsletter", formData.get("email"));
    return { success: true, message: "Subscribed successfully!", error: undefined };
}
