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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Loader2, Shield, Lock } from "lucide-react";
import { createRole, updateRole, deleteRole, getRole, getAllPermissions, type Role, type Permission } from "../actions";

interface RoleDialogProps {
    role?: Role;
}

// Module display names
const MODULE_LABELS: Record<string, string> = {
    dashboard: "Dashboard",
    analytics: "Analytics",
    universities: "Universities",
    programs: "Programs",
    scholarships: "Scholarships",
    academic_years: "Academic Years",
    languages: "Languages",
    admission_requirements: "Admission Requirements",
    program_catalog: "Program Catalog",
    applications: "Applications",
    leads: "Leads",
    documents: "Documents",
    users: "Users",
    roles: "Roles",
    articles: "Articles",
    messages: "Messages",
    refunds: "Refunds",
    settings: "Settings",
};

// Action display names
const ACTION_LABELS: Record<string, string> = {
    view: "View",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    send: "Send",
    approve: "Approve",
};

export function RoleDialog({ role }: RoleDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
    const [formData, setFormData] = useState({
        name: "",
        display_name: "",
        description: "",
    });

    // Load permissions and role data when dialog opens
    useEffect(() => {
        if (open) {
            loadData();
        }
    }, [open, role?.id]);

    async function loadData() {
        setIsLoadingData(true);

        // Load all available permissions
        const permResult = await getAllPermissions();
        if (permResult.success && permResult.data) {
            setAllPermissions(permResult.data);
        }

        // If editing, load role with its permissions
        if (role?.id) {
            const roleResult = await getRole(role.id);
            if (roleResult.success && roleResult.data) {
                setFormData({
                    name: roleResult.data.name,
                    display_name: roleResult.data.display_name,
                    description: roleResult.data.description || "",
                });
                setSelectedPermissions(new Set(roleResult.data.permissions.map(p => p.id)));
            }
        } else {
            // Reset for new role
            setFormData({ name: "", display_name: "", description: "" });
            setSelectedPermissions(new Set());
        }

        setIsLoadingData(false);
    }

    // Group permissions by module
    const permissionsByModule = allPermissions.reduce((acc, perm) => {
        if (!acc[perm.module]) {
            acc[perm.module] = [];
        }
        acc[perm.module].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    function togglePermission(permId: string) {
        const newSelected = new Set(selectedPermissions);
        if (newSelected.has(permId)) {
            newSelected.delete(permId);
        } else {
            newSelected.add(permId);
        }
        setSelectedPermissions(newSelected);
    }

    function toggleModule(module: string) {
        const modulePerm = permissionsByModule[module] || [];
        const allSelected = modulePerm.every(p => selectedPermissions.has(p.id));

        const newSelected = new Set(selectedPermissions);
        if (allSelected) {
            // Deselect all in this module
            modulePerm.forEach(p => newSelected.delete(p.id));
        } else {
            // Select all in this module
            modulePerm.forEach(p => newSelected.add(p.id));
        }
        setSelectedPermissions(newSelected);
    }

    function selectAll() {
        setSelectedPermissions(new Set(allPermissions.map(p => p.id)));
    }

    function deselectAll() {
        setSelectedPermissions(new Set());
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const data = {
            name: formData.name,
            display_name: formData.display_name,
            description: formData.description,
            permission_ids: Array.from(selectedPermissions),
        };

        let result;

        if (role) {
            result = await updateRole(role.id, data);
        } else {
            result = await createRole(data);
        }

        if (result.success) {
            toast.success(role ? "Role updated successfully" : "Role created successfully");
            setOpen(false);
        } else {
            toast.error(result.error || "Operation failed");
        }

        setIsLoading(false);
    }

    async function handleDelete() {
        if (!role) return;
        if (!confirm(`Are you sure you want to delete the "${role.display_name}" role?`)) return;

        setIsLoading(true);
        const result = await deleteRole(role.id);

        if (result.success) {
            toast.success("Role deleted successfully");
            setOpen(false);
        } else {
            toast.error(result.error || "Failed to delete role");
        }

        setIsLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {role ? (
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Role
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        {role ? "Edit Role" : "Create New Role"}
                        {role?.is_system && (
                            <Badge variant="secondary" className="ml-2">
                                <Lock className="h-3 w-3 mr-1" />
                                System
                            </Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {role
                            ? "Update role information and permissions"
                            : "Create a new role and assign permissions"
                        }
                    </DialogDescription>
                </DialogHeader>

                {isLoadingData ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-hidden">
                        {/* Role Info */}
                        <div className="space-y-4 px-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Role Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="data_entry"
                                        disabled={role?.is_system}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Lowercase, no spaces (use underscores)
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="display_name">Display Name *</Label>
                                    <Input
                                        id="display_name"
                                        value={formData.display_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                                        placeholder="Data Entry"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Can manage universities and programs"
                                    rows={2}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Permissions */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <Label className="text-base font-semibold">
                                    Permissions ({selectedPermissions.size} / {allPermissions.length})
                                </Label>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={selectAll}>
                                        Select All
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={deselectAll}>
                                        Clear All
                                    </Button>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 max-h-[300px] border rounded-lg p-3">
                                <div className="space-y-4">
                                    {Object.entries(permissionsByModule).map(([module, perms]) => {
                                        const allSelected = perms.every(p => selectedPermissions.has(p.id));
                                        const someSelected = perms.some(p => selectedPermissions.has(p.id));

                                        return (
                                            <div key={module} className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`module-${module}`}
                                                        checked={allSelected}
                                                        // @ts-ignore - indeterminate is valid
                                                        indeterminate={someSelected && !allSelected}
                                                        onCheckedChange={() => toggleModule(module)}
                                                    />
                                                    <Label
                                                        htmlFor={`module-${module}`}
                                                        className="font-semibold cursor-pointer"
                                                    >
                                                        {MODULE_LABELS[module] || module}
                                                    </Label>
                                                </div>
                                                <div className="ml-6 flex flex-wrap gap-3">
                                                    {perms.map(perm => (
                                                        <div key={perm.id} className="flex items-center gap-1.5">
                                                            <Checkbox
                                                                id={`perm-${perm.id}`}
                                                                checked={selectedPermissions.has(perm.id)}
                                                                onCheckedChange={() => togglePermission(perm.id)}
                                                            />
                                                            <Label
                                                                htmlFor={`perm-${perm.id}`}
                                                                className="text-sm cursor-pointer text-muted-foreground"
                                                            >
                                                                {ACTION_LABELS[perm.action] || perm.action}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </div>

                        <DialogFooter className="flex justify-between sm:justify-between pt-4">
                            {role && !role.is_system && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Role
                                </Button>
                            )}
                            {role?.is_system && (
                                <p className="text-xs text-muted-foreground">
                                    System roles cannot be deleted
                                </p>
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
                                    {role ? "Update Role" : "Create Role"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
