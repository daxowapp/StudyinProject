"use server";

export async function submitLead(data: any) {
    // Mock implementation
    console.log("Submitting lead", data);
    return { success: true, message: "Lead submitted successfully!", error: undefined };
}
