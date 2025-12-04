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
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { createAcademicYear, updateAcademicYear, deleteAcademicYear } from "../actions";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface AcademicYearDialogProps {
    academicYear?: {
        id: string;
        name: string;
        start_date: string;
        end_date: string;
        is_active: boolean;
    };
}

export function AcademicYearDialog({ academicYear }: AcademicYearDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            const result = academicYear
                ? await updateAcademicYear(academicYear.id, formData)
                : await createAcademicYear(formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(
                    academicYear ? "Academic year updated" : "Academic year created"
                );
                setOpen(false);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        if (!academicYear || !confirm("Are you sure? This will delete all associated intakes.")) return;

        setIsLoading(true);
        try {
            const result = await deleteAcademicYear(academicYear.id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Academic year deleted");
                setOpen(false);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {academicYear ? (
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Academic Year
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {academicYear ? "Edit Academic Year" : "Create Academic Year"}
                    </DialogTitle>
                    <DialogDescription>
                        Set up the academic calendar for admissions.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={academicYear?.name}
                            placeholder="e.g. 2024-2025"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input
                                id="start_date"
                                name="start_date"
                                type="date"
                                defaultValue={academicYear?.start_date}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input
                                id="end_date"
                                name="end_date"
                                type="date"
                                defaultValue={academicYear?.end_date}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            name="is_active"
                            defaultChecked={academicYear?.is_active ?? true}
                        />
                        <Label htmlFor="is_active">Active Year</Label>
                    </div>
                    <DialogFooter className="flex justify-between sm:justify-between">
                        {academicYear && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={handleDelete}
                                disabled={isLoading}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
