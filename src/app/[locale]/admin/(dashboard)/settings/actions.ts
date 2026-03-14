"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireStrictAdminRole } from "@/lib/auth/admin-guard";

/**
 * Get a site setting value by key
 */
export async function getSiteSetting(key: string): Promise<string | null> {
    await requireStrictAdminRole();
    const supabase = await createClient();

    const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .single();

    return data?.value ?? null;
}

/**
 * Save a site setting (upsert by key)
 * Only strict admins can modify site settings.
 */
export async function saveSiteSetting(key: string, value: string) {
    await requireStrictAdminRole();

    // Use admin client to bypass RLS policies
    const supabase = await createAdminClient();

    const { error } = await supabase
        .from("site_settings")
        .upsert(
            { key, value, updated_at: new Date().toISOString() },
            { onConflict: "key" }
        );

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/settings");
    return { success: true };
}
