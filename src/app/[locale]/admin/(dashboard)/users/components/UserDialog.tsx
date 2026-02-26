"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Loader2, Shield, UserCog, Users } from "lucide-react";
import { createUser, deleteUser, updateUser } from "../actions";
import { getRoles, type Role } from "../../roles/actions";

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    role_id?: string;
    phone: string;
    nationality: string;
    created_at: string;
}

interface UserDialogProps {
    user?: User;
}

// Icon mapping for built-in roles
const ROLE_ICONS: Record<string, any> = {
    admin: Shield,
    data_entry: UserCog,
    marketing: Users,
    student: Users,
};

// Color mapping for built-in roles
const ROLE_COLORS: Record<string, string> = {
    admin: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
    data_entry: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
    marketing: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    student: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200",
};

export function UserDialog({ user }: UserDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState(user?.role_id || "");

    // Fetch roles when dialog opens
    useEffect(() => {
        if (open) {
            loadRoles();
        }
    }, [open]);

    async function loadRoles() {
        setIsLoadingRoles(true);
        const result = await getRoles();
        if (result.success && result.data) {
            setRoles(result.data);
            // Set initial role if user has one
            if (user?.role_id) {
                setSelectedRoleId(user.role_id);
            } else if (user?.role) {
                // Fallback: find role by name for backward compatibility
                const matchingRole = result.data.find(r => r.name === user.role);
                if (matchingRole) {
                    setSelectedRoleId(matchingRole.id);
                }
            } else if (!user) {
                // For new users, default to student
                const studentRole = result.data.find(r => r.name === "student");
                if (studentRole) {
                    setSelectedRoleId(studentRole.id);
                }
            }
        }
        setIsLoadingRoles(false);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const selectedRole = roles.find(r => r.id === selectedRoleId);

        const data = {
            first_name: formData.get("first_name") as string,
            last_name: formData.get("last_name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            password: formData.get("password") as string,
            role: selectedRole?.name || "student",
            role_id: selectedRoleId,
        };

        let result;

        if (user) {
            result = await updateUser(user.id, data);
        } else {
            result = await createUser(data);
        }

        if (result.success) {
            toast.success(user ? "User updated successfully" : "User created successfully");
            setOpen(false);
        } else {
            toast.error(result.error || "Operation failed");
        }

        setIsLoading(false);
    }

    async function handleDelete() {
        if (!user) return;
        if (!confirm("Are you sure you want to delete this user?")) return;

        setIsLoading(true);
        const result = await deleteUser(user.id);

        if (result.success) {
            toast.success("User deleted successfully");
            setOpen(false);
        } else {
            toast.error(result.error || "Failed to delete user");
        }

        setIsLoading(false);
    }

    const selectedRole = roles.find(r => r.id === selectedRoleId);
    const RoleIcon = selectedRole ? (ROLE_ICONS[selectedRole.name] || Shield) : Shield;
    const roleColor = selectedRole ? (ROLE_COLORS[selectedRole.name] || "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200") : "";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {user ? (
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {user ? "Edit User" : "Create New User"}
                    </DialogTitle>
                    <DialogDescription>
                        {user
                            ? "Update user information and permissions"
                            : "Add a new user to the system with specific role and permissions"
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">First Name *</Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    defaultValue={user?.first_name}
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Last Name *</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    defaultValue={user?.last_name}
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={user?.email}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                defaultValue={user?.phone}
                                placeholder="+1234567890"
                            />
                        </div>
                        {!user && (
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Minimum 8 characters
                                </p>
                            </div>
                        )}
                        {user && (
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Role & Permissions */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Role & Permissions</h3>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">User Role *</Label>
                            {isLoadingRoles ? (
                                <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-muted/50">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm text-muted-foreground">Loading roles...</span>
                                </div>
                            ) : (
                                <Select
                                    name="role"
                                    value={selectedRoleId}
                                    onValueChange={setSelectedRoleId}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.id}>
                                                {role.display_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        {/* Role Info Display */}
                        {selectedRole && (
                            <div className={`p-4 rounded-lg border-2 ${roleColor}`}>
                                <div className="flex items-start gap-3">
                                    <RoleIcon className="h-5 w-5 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="font-semibold mb-1">
                                            {selectedRole.display_name}
                                        </div>
                                        <p className="text-sm opacity-90">
                                            {selectedRole.description || "No description available"}
                                        </p>
                                        <div className="mt-3">
                                            <p className="text-xs font-semibold">
                                                Permissions: {selectedRole.permission_count || 0}
                                            </p>
                                            <p className="text-xs opacity-80 mt-1">
                                                {selectedRole.is_system ? "System role (cannot be deleted)" : "Custom role"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex justify-between sm:justify-between">
                        {user && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                                disabled={isLoading}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                            </Button>
                        )}
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading || isLoadingRoles}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {user ? "Update User" : "Create User"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h1>Title</h1>
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
