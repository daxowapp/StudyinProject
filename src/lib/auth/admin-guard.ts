"use server";

import { createClient } from "@/lib/supabase/server";

export type AdminRole = "admin" | "data_entry" | "marketing";

const ADMIN_ROLES: AdminRole[] = ["admin", "data_entry", "marketing"];

/**
 * Verifies that the current user has an admin role.
 * Throws an error if the user is not authenticated or not an admin.
 * Returns the authenticated user and their role.
 */
export async function requireAdminRole(allowedRoles: AdminRole[] = ADMIN_ROLES) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("Unauthorized: Not authenticated");
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        throw new Error("Unauthorized: Profile not found");
    }

    if (!allowedRoles.includes(profile.role as AdminRole)) {
        throw new Error("Forbidden: Insufficient permissions");
    }

    return { user, role: profile.role as AdminRole };
}

/**
 * Verifies admin role only (no data_entry or marketing).
 */
export async function requireStrictAdminRole() {
    return requireAdminRole(["admin"]);
}
