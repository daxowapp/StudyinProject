"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { PORTAL_KEY } from "@/lib/constants/portal";
import { requireAdminRole } from "@/lib/auth/admin-guard";

export async function getLeads() {
    await requireAdminRole();
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("portal_key", PORTAL_KEY)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function updateLeadStatus(id: string, status: string) {
    await requireAdminRole();
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
    await requireAdminRole();
    const supabase = await createClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/admin/leads");
    return { success: true };
}
