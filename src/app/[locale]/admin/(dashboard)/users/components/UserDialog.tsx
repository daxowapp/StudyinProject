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
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Loader2, Shield, UserCog, Users } from "lucide-react";

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    phone: string;
    nationality: string;
    created_at: string;
}

interface UserDialogProps {
    user?: User;
}

// User roles with permissions
const USER_ROLES = [
    {
        value: "admin",
        label: "Admin",
        description: "Full access to all features",
        icon: Shield,
        color: "bg-red-100 text-red-800"
    },
    {
        value: "data_entry",
        label: "Data Entry",
        description: "Can add/edit universities and programs",
        icon: UserCog,
        color: "bg-blue-100 text-blue-800"
    },
    {
        value: "marketing",
        label: "Marketing & Leads",
        description: "Can manage students, leads, and applications",
        icon: Users,
        color: "bg-green-100 text-green-800"
    },
    {
        value: "student",
        label: "Student",
        description: "Regular student account",
        icon: Users,
        color: "bg-gray-100 text-gray-800"
    }
];

export function UserDialog({ user }: UserDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(user?.role || "student");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);




        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success(user ? "User updated successfully" : "User created successfully");
        setIsLoading(false);
        setOpen(false);
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this user?")) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("User deleted successfully");
        setIsLoading(false);
        setOpen(false);
    }

    const selectedRoleInfo = USER_ROLES.find(r => r.value === selectedRole);

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
                            <Select
                                name="role"
                                defaultValue={user?.role || "student"}
                                onValueChange={setSelectedRole}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {USER_ROLES.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Role Info Display */}
                        {selectedRoleInfo && (
                            <div className={`p-4 rounded-lg border-2 ${selectedRoleInfo.color}`}>
                                <div className="flex items-start gap-3">
                                    <selectedRoleInfo.icon className="h-5 w-5 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="font-semibold mb-1">
                                            {selectedRoleInfo.label}
                                        </div>
                                        <p className="text-sm opacity-90">
                                            {selectedRoleInfo.description}
                                        </p>

                                        {/* Permissions List */}
                                        <div className="mt-3 space-y-1">
                                            <p className="text-xs font-semibold">Permissions:</p>
                                            <ul className="text-xs space-y-1 ml-4">
                                                {selectedRoleInfo.value === "admin" && (
                                                    <>
                                                        <li>✓ Full system access</li>
                                                        <li>✓ Manage all users and roles</li>
                                                        <li>✓ Access all features</li>
                                                        <li>✓ System settings</li>
                                                    </>
                                                )}
                                                {selectedRoleInfo.value === "data_entry" && (
                                                    <>
                                                        <li>✓ Add/Edit universities</li>
                                                        <li>✓ Add/Edit programs</li>
                                                        <li>✓ Manage program catalog</li>
                                                        <li>✓ Update university details</li>
                                                        <li>✗ Cannot access leads/applications</li>
                                                    </>
                                                )}
                                                {selectedRoleInfo.value === "marketing" && (
                                                    <>
                                                        <li>✓ View/Manage leads</li>
                                                        <li>✓ View/Manage applications</li>
                                                        <li>✓ Contact students</li>
                                                        <li>✓ View analytics</li>
                                                        <li>✗ Cannot edit universities/programs</li>
                                                    </>
                                                )}
                                                {selectedRoleInfo.value === "student" && (
                                                    <>
                                                        <li>✓ Browse programs</li>
                                                        <li>✓ Submit applications</li>
                                                        <li>✓ Track application status</li>
                                                        <li>✗ No admin access</li>
                                                    </>
                                                )}
                                            </ul>
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
                            <Button type="submit" disabled={isLoading}>
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
