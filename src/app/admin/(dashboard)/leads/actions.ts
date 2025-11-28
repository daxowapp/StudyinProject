"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getLeads() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function updateLeadStatus(id: string, status: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/leads");
    return { success: true };
}

export async function deleteLead(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/leads");
    return { success: true };
}
