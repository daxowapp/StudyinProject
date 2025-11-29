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
                program_catalog:program_catalog_id (
                    title,
                    level,
                    duration
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
