import { createAdminClient } from "@/lib/supabase/server";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Lock } from "lucide-react";
import { RoleDialog } from "./components/RoleDialog";

interface Role {
    id: string;
    name: string;
    display_name: string;
    description: string | null;
    is_system: boolean;
    created_at: string;
    permission_count: number;
    user_count: number;
}

async function getRolesWithCounts(): Promise<Role[]> {
    const supabase = await createAdminClient();

    // Get roles with permission counts
    const { data: roles, error } = await supabase
        .from('roles')
        .select(`
            id,
            name,
            display_name,
            description,
            is_system,
            created_at
        `)
        .order('name');

    if (error || !roles) {
        console.error("Error fetching roles:", error);
        return [];
    }

    // Get permission counts for each role
    const rolesWithCounts = await Promise.all(
        roles.map(async (role) => {
            const { count: permCount } = await supabase
                .from('role_permissions')
                .select('*', { count: 'exact', head: true })
                .eq('role_id', role.id);

            const { count: userCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role_id', role.id);

            return {
                ...role,
                permission_count: permCount || 0,
                user_count: userCount || 0,
            };
        })
    );

    return rolesWithCounts;
}

export default async function RolesPage() {
    const roles = await getRolesWithCounts();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Shield className="h-8 w-8 text-primary" />
                        Roles & Permissions
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage user roles and their permissions
                    </p>
                </div>
                <RoleDialog />
            </div>

            {/* Roles Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Roles</CardTitle>
                    <CardDescription>
                        {roles.length} role{roles.length !== 1 ? 's' : ''} configured
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Permissions</TableHead>
                                <TableHead className="text-center">Users</TableHead>
                                <TableHead className="text-center">Type</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No roles found. Create your first role to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{role.display_name}</p>
                                                <p className="text-xs text-muted-foreground">{role.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[300px]">
                                            <p className="text-sm text-muted-foreground truncate">
                                                {role.description || "—"}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">
                                                {role.permission_count}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>{role.user_count}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {role.is_system ? (
                                                <Badge variant="outline" className="gap-1">
                                                    <Lock className="h-3 w-3" />
                                                    System
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">Custom</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <RoleDialog role={role} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-muted/50">
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium">About Roles & Permissions</p>
                            <p className="text-sm text-muted-foreground">
                                Roles define what users can access in the admin panel. Each role has a set of permissions
                                that control access to different modules and actions. System roles (admin, data_entry, marketing, student)
                                cannot be deleted but their permissions can be modified.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
