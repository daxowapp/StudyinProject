"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Types
export interface Role {
    id: string;
    name: string;
    display_name: string;
    description: string | null;
    is_system: boolean;
    created_at: string;
    permission_count?: number;
}

export interface Permission {
    id: string;
    module: string;
    action: string;
    description: string | null;
}

export interface RoleWithPermissions extends Role {
    permissions: Permission[];
}

type ActionResponse<T = void> = {
    success: boolean;
    error?: string;
    data?: T;
};

// =====================================================
// READ OPERATIONS
// =====================================================

export async function getRoles(): Promise<ActionResponse<Role[]>> {
    try {
        const supabase = await createAdminClient();
        
        const { data, error } = await supabase
            .from('roles')
            .select(`
                id,
                name,
                display_name,
                description,
                is_system,
                created_at,
                role_permissions(count)
            `)
            .order('name');

        if (error) {
            console.error("Error fetching roles:", error);
            return { success: false, error: error.message };
        }

        // Transform to include permission count
        const roles = data?.map(role => ({
            ...role,
            permission_count: (role.role_permissions as any)?.[0]?.count || 0,
            role_permissions: undefined
        })) || [];

        return { success: true, data: roles };
    } catch (error) {
        console.error("Unexpected error fetching roles:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

export async function getRole(roleId: string): Promise<ActionResponse<RoleWithPermissions>> {
    try {
        const supabase = await createAdminClient();
        
        // Get role with its permissions
        const { data: role, error: roleError } = await supabase
            .from('roles')
            .select('*')
            .eq('id', roleId)
            .single();

        if (roleError) {
            return { success: false, error: roleError.message };
        }

        // Get permissions for this role
        const { data: rolePermissions, error: permError } = await supabase
            .from('role_permissions')
            .select(`
                permission_id,
                permissions (
                    id,
                    module,
                    action,
                    description
                )
            `)
            .eq('role_id', roleId);

        if (permError) {
            return { success: false, error: permError.message };
        }

        const permissions = rolePermissions?.map(rp => (rp.permissions as any)) || [];

        return {
            success: true,
            data: {
                ...role,
                permissions
            }
        };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred" };
    }
}

export async function getAllPermissions(): Promise<ActionResponse<Permission[]>> {
    try {
        const supabase = await createAdminClient();
        
        const { data, error } = await supabase
            .from('permissions')
            .select('*')
            .order('module')
            .order('action');

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred" };
    }
}

// Get permissions grouped by module
export async function getPermissionsGrouped(): Promise<ActionResponse<Record<string, Permission[]>>> {
    try {
        const result = await getAllPermissions();
        
        if (!result.success || !result.data) {
            return { success: false, error: result.error };
        }

        const grouped = result.data.reduce((acc, perm) => {
            if (!acc[perm.module]) {
                acc[perm.module] = [];
            }
            acc[perm.module].push(perm);
            return acc;
        }, {} as Record<string, Permission[]>);

        return { success: true, data: grouped };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred" };
    }
}

// =====================================================
// WRITE OPERATIONS
// =====================================================

export async function createRole(data: {
    name: string;
    display_name: string;
    description?: string;
    permission_ids?: string[];
}): Promise<ActionResponse<Role>> {
    try {
        const supabase = await createAdminClient();
        const { name, display_name, description, permission_ids } = data;

        // Validate name format (lowercase, no spaces)
        const validName = name.toLowerCase().replace(/\s+/g, '_');

        // Create role
        const { data: role, error: roleError } = await supabase
            .from('roles')
            .insert({
                name: validName,
                display_name,
                description: description || null,
                is_system: false
            })
            .select()
            .single();

        if (roleError) {
            console.error("Error creating role:", roleError);
            return { success: false, error: roleError.message };
        }

        // Assign permissions if provided
        if (permission_ids && permission_ids.length > 0) {
            const permissionAssignments = permission_ids.map(perm_id => ({
                role_id: role.id,
                permission_id: perm_id
            }));

            const { error: permError } = await supabase
                .from('role_permissions')
                .insert(permissionAssignments);

            if (permError) {
                console.error("Error assigning permissions:", permError);
                // Role created but permissions failed - don't fail the whole operation
            }
        }

        revalidatePath("/admin/roles");
        return { success: true, data: role };
    } catch (error) {
        console.error("Unexpected error creating role:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

export async function updateRole(roleId: string, data: {
    display_name: string;
    description?: string;
    permission_ids?: string[];
}): Promise<ActionResponse> {
    try {
        const supabase = await createAdminClient();
        const { display_name, description, permission_ids } = data;

        // Check if role is system role (name cannot be changed)
        const { data: existingRole, error: fetchError } = await supabase
            .from('roles')
            .select('is_system')
            .eq('id', roleId)
            .single();

        if (fetchError) {
            return { success: false, error: "Role not found" };
        }

        // Update role details
        const { error: updateError } = await supabase
            .from('roles')
            .update({
                display_name,
                description: description || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', roleId);

        if (updateError) {
            return { success: false, error: updateError.message };
        }

        // Update permissions if provided
        if (permission_ids !== undefined) {
            // Remove all existing permissions
            const { error: deleteError } = await supabase
                .from('role_permissions')
                .delete()
                .eq('role_id', roleId);

            if (deleteError) {
                console.error("Error removing old permissions:", deleteError);
            }

            // Add new permissions
            if (permission_ids.length > 0) {
                const permissionAssignments = permission_ids.map(perm_id => ({
                    role_id: roleId,
                    permission_id: perm_id
                }));

                const { error: insertError } = await supabase
                    .from('role_permissions')
                    .insert(permissionAssignments);

                if (insertError) {
                    console.error("Error assigning new permissions:", insertError);
                    return { success: false, error: "Role updated but permissions failed" };
                }
            }
        }

        revalidatePath("/admin/roles");
        return { success: true };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred" };
    }
}

export async function deleteRole(roleId: string): Promise<ActionResponse> {
    try {
        const supabase = await createAdminClient();

        // Check if role is system role
        const { data: role, error: fetchError } = await supabase
            .from('roles')
            .select('is_system, name')
            .eq('id', roleId)
            .single();

        if (fetchError) {
            return { success: false, error: "Role not found" };
        }

        if (role.is_system) {
            return { success: false, error: "Cannot delete system roles" };
        }

        // Check if any users are assigned to this role
        const { count, error: countError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role_id', roleId);

        if (countError) {
            return { success: false, error: "Error checking role usage" };
        }

        if (count && count > 0) {
            return { success: false, error: `Cannot delete role: ${count} user(s) are assigned to it` };
        }

        // Delete role (cascade will remove role_permissions)
        const { error: deleteError } = await supabase
            .from('roles')
            .delete()
            .eq('id', roleId);

        if (deleteError) {
            return { success: false, error: deleteError.message };
        }

        revalidatePath("/admin/roles");
        return { success: true };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred" };
    }
}

// =====================================================
// USER PERMISSION HELPERS
// =====================================================

export async function getUserPermissions(userId?: string): Promise<ActionResponse<string[]>> {
    try {
        const supabase = await createAdminClient();
        
        // If no userId, get current user
        let targetUserId = userId;
        if (!targetUserId) {
            const { data: { user } } = await supabase.auth.getUser();
            targetUserId = user?.id;
        }

        if (!targetUserId) {
            return { success: false, error: "No user found" };
        }

        // Get user's role_id
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role_id')
            .eq('id', targetUserId)
            .single();

        if (profileError || !profile?.role_id) {
            return { success: true, data: [] }; // No permissions
        }

        // Get all permissions for this role
        const { data: rolePermissions, error: permError } = await supabase
            .from('role_permissions')
            .select(`
                permissions (
                    module,
                    action
                )
            `)
            .eq('role_id', profile.role_id);

        if (permError) {
            return { success: false, error: permError.message };
        }

        // Format as "module.action" strings
        const permissions = rolePermissions?.map(rp => {
            const perm = rp.permissions as any;
            return `${perm.module}.${perm.action}`;
        }) || [];

        return { success: true, data: permissions };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred" };
    }
}
