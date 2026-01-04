"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Define return type for actions
type ActionResponse = {
    success: boolean;
    error?: string;
};

export async function createUser(data: {
    email: string;
    password?: string;
    first_name: string;
    last_name: string;
    role: string;
    role_id?: string;
    phone?: string;
}): Promise<ActionResponse> {
    try {
        const supabase = await createAdminClient();
        const { email, password, first_name, last_name, role, role_id, phone } = data;

        // 1. Create user in Supabase Auth
        // We use admin.createUser to skip email verification if needed, or just standard signup
        // admin.createUser allows setting a password directly without email confirmation flow if autoConfirm is on
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email,
            password: password || undefined, // Password is required for manual creation usually, or we can generate one
            email_confirm: true, // Auto confirm email
            user_metadata: {
                first_name,
                last_name,
                role // Store role in metadata too for easy access
            }
        });

        if (authError) {
            console.error("Auth creation error:", authError);
            return { success: false, error: authError.message };
        }

        if (!authUser.user) {
            return { success: false, error: "Failed to create user object" };
        }

        // 2. Create profile in public table
        // Note: If you have a trigger that creates a profile on auth.users insert, 
        // this might fail with duplicate key or we should update instead. 
        // Let's assume we need to upsert or update the profile with specific fields.

        // Check if profile exists (created by trigger)
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', authUser.user.id)
            .single();

        if (existingProfile) {
            // Update existing profile
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    first_name,
                    last_name,
                    role,
                    role_id: role_id || null,
                    email, // Keep email in sync
                    phone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', authUser.user.id);

            if (profileError) {
                console.error("Profile update error:", profileError);
                // Try to cleanup auth user if profile fails? 
                // For now, return error but user exists in auth.
                return { success: false, error: "User created but profile update failed: " + profileError.message };
            }
        } else {
            // Insert new profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authUser.user.id,
                    first_name,
                    last_name,
                    role,
                    role_id: role_id || null,
                    email,
                    phone: phone || null,
                    updated_at: new Date().toISOString()
                });

            if (profileError) {
                console.error("Profile creation error:", profileError);
                return { success: false, error: "User created but profile creation failed: " + profileError.message };
            }
        }

        revalidatePath("/admin/users");
        return { success: true };

    } catch (error) {
        console.error("Create user unexpected error:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

export async function updateUser(userId: string, data: {
    first_name: string;
    last_name: string;
    role: string;
    role_id?: string;
    phone?: string;
    email?: string;
    password?: string;
}): Promise<ActionResponse> {
    try {
        const supabase = await createAdminClient();
        const { first_name, last_name, role, role_id, phone, email, password } = data;

        // 1. Update Auth User (email/password) if provided
        const authUpdates: any = {
            user_metadata: {
                first_name,
                last_name,
                role
            }
        };

        if (email) authUpdates.email = email;
        if (password && password.trim() !== "") authUpdates.password = password;

        if (Object.keys(authUpdates).length > 0) {
            const { error: authError } = await supabase.auth.admin.updateUserById(
                userId,
                authUpdates
            );

            if (authError) {
                return { success: false, error: authError.message };
            }
        }

        // 2. Update Profile
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                first_name,
                last_name,
                role,
                role_id: role_id || null,
                phone: phone || null,
                ...(email ? { email } : {}), // Update email in specific column if exists
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (profileError) {
            return { success: false, error: profileError.message };
        }

        revalidatePath("/admin/users");
        return { success: true };

    } catch (error) {
        return { success: false, error: "An unexpected error occurred" };
    }
}

export async function deleteUser(userId: string): Promise<ActionResponse> {
    try {
        const supabase = await createAdminClient();

        // Delete from Auth (cascades to profile usually if setup correctly)
        const { error } = await supabase.auth.admin.deleteUser(userId);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred" };
    }
}
