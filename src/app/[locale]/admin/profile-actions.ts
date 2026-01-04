"use server";

import { createClient } from "@/lib/supabase/server";

export interface UserProfile {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    role: string | null;
    role_id: string | null;
    role_name: string | null;
    permissions: string[];
}

export async function getUserProfile(): Promise<UserProfile | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Get profile with role info
    const { data: profile } = await supabase
        .from("profiles")
        .select(`
            first_name, 
            last_name, 
            email, 
            role,
            role_id,
            roles (
                name,
                display_name
            )
        `)
        .eq("id", user.id)
        .single();

    if (!profile) return null;

    // Get permissions for this user's role
    let permissions: string[] = [];

    if (profile.role_id) {
        const { data: rolePermissions } = await supabase
            .from('role_permissions')
            .select(`
                permissions (
                    module,
                    action
                )
            `)
            .eq('role_id', profile.role_id);

        if (rolePermissions) {
            permissions = rolePermissions.map(rp => {
                const perm = rp.permissions as any;
                return `${perm.module}.${perm.action}`;
            });
        }
    }

    return {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        role: (profile.roles as any)?.display_name || profile.role,
        role_id: profile.role_id,
        role_name: (profile.roles as any)?.name || profile.role,
        permissions,
    };
}
