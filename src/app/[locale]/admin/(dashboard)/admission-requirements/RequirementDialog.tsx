"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createRequirement, updateRequirement, deleteRequirement } from "./actions";
import { Pencil, Trash2 } from "lucide-react";

interface Requirement {
    id: string;
    title: string;
    category: string;
    requirement_type: string;
    description: string;
    is_common: boolean;
}

interface RequirementDialogProps {
    requirement?: Requirement;
    onSuccess: () => void;
}

export function RequirementDialog({ requirement, onSuccess }: RequirementDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: requirement?.title || "",
        category: requirement?.category || "academic",
        requirement_type: requirement?.requirement_type || "all",
        description: requirement?.description || "",
        is_common: requirement?.is_common ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = requirement
            ? await updateRequirement(requirement.id, formData)
            : await createRequirement(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(requirement ? "Requirement updated" : "Requirement created");
            setOpen(false);
            onSuccess();
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button
                variant={requirement ? "ghost" : "default"}
                size={requirement ? "sm" : "default"}
                onClick={() => setOpen(true)}
            >
                {requirement ? (
                    <Pencil className="h-4 w-4" />
                ) : (
                    <>
                        <span className="mr-2">+</span> Add Requirement
                    </>
                )}
            </Button>
            <DialogContent className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {requirement ? "Edit Requirement" : "Add New Requirement"}
                        </DialogTitle>
                        <DialogDescription>
                            {requirement
                                ? "Update the requirement details"
                                : "Create a new admission requirement for the catalog"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                placeholder="e.g., IELTS, Valid Passport"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, category: value })
                                    }
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="academic">Academic</SelectItem>
                                        <SelectItem value="language">Language</SelectItem>
                                        <SelectItem value="document">Document</SelectItem>
                                        <SelectItem value="financial">Financial</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Program Level *</Label>
                                <Select
                                    value={formData.requirement_type}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, requirement_type: value })
                                    }
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Levels</SelectItem>
                                        <SelectItem value="bachelor">Bachelor Only</SelectItem>
                                        <SelectItem value="master">Master Only</SelectItem>
                                        <SelectItem value="phd">PhD Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                required
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Describe the requirement..."
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_common"
                                checked={formData.is_common}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, is_common: checked })
                                }
                            />
                            <Label htmlFor="is_common">
                                Common requirement (recommended for most universities)
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : requirement ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface DeleteButtonProps {
    requirementId: string;
    requirementTitle: string;
    onSuccess: () => void;
}

export function DeleteButton({ requirementId, requirementTitle, onSuccess }: DeleteButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${requirementTitle}"?`)) return;

        setLoading(true);
        const result = await deleteRequirement(requirementId);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Requirement deleted");
            onSuccess();
        }
        setLoading(false);
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="text-destructive hover:text-destructive"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
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
