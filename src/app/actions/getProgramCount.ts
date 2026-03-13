"use server";

import { createClient } from "@/lib/supabase/server";
import { PORTAL_KEY } from "@/lib/constants/portal";

export async function getProgramCount(): Promise<number> {
    const supabase = await createClient();

    const { count } = await supabase
        .from("v_university_programs_full")
        .select("*", { count: "exact", head: true })
        .eq("portal_key", PORTAL_KEY)
        .eq("is_active", true);

    return count || 0;
}
