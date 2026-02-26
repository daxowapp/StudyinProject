import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, UserCog, Users as UsersIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { UserDialog } from "./components/UserDialog";

export default async function AdminUsersPage() {
    const supabase = await createClient();
    const { data: users } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    // Count users by role
    const adminCount = users?.filter(u => u.role === "admin").length || 0;
    const dataEntryCount = users?.filter(u => u.role === "data_entry").length || 0;
    const marketingCount = users?.filter(u => u.role === "marketing").length || 0;
    const studentCount = users?.filter(u => u.role === "student" || !u.role).length || 0;

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "admin":
                return <Badge className="bg-red-600">Admin</Badge>;
            case "data_entry":
                return <Badge className="bg-blue-600">Data Entry</Badge>;
            case "marketing":
                return <Badge className="bg-green-600">Marketing</Badge>;
            default:
                return <Badge variant="secondary">Student</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Users & Roles</h1>
                    <p className="text-muted-foreground">Manage users and their permissions.</p>
                </div>
                <UserDialog />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Admins</CardTitle>
                        <Shield className="h-5 w-5 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{adminCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Full access</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Data Entry</CardTitle>
                        <UserCog className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{dataEntryCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Universities & Programs</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Marketing</CardTitle>
                        <UsersIcon className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{marketingCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Leads & Applications</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <UsersIcon className="h-5 w-5 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{studentCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Regular users</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Search users..." />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Nationality</TableHead>
                            <TableHead>Joined Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((user: { id: string; first_name: string; last_name: string; email: string; role: string; nationality: string; created_at: string; phone?: string }) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    {user.first_name} {user.last_name}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        {user.email}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {getRoleBadge(user.role)}
                                </TableCell>
                                <TableCell>{user.nationality || "-"}</TableCell>
                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <UserDialog user={{ ...user, phone: user.phone || "" }} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!users || users.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
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
