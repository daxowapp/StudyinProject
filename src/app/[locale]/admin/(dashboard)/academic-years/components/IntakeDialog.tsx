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
import { createIntake, updateIntake, deleteIntake } from "../actions";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface IntakeDialogProps {
    academicYearId: string;
    intake?: {
        id: string;
        name: string;
        start_date: string;
        end_date: string;
        is_open: boolean;
    };
}

export function IntakeDialog({ academicYearId, intake }: IntakeDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            const result = intake
                ? await updateIntake(intake.id, formData)
                : await createIntake(academicYearId, formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(intake ? "Intake updated" : "Intake created");
                setOpen(false);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        if (!intake || !confirm("Are you sure you want to delete this intake?")) return;

        setIsLoading(true);
        try {
            const result = await deleteIntake(intake.id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Intake deleted");
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
                {intake ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-3 w-3" />
                    </Button>
                ) : (
                    <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-3 w-3" /> Add Intake
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {intake ? "Edit Intake" : "Create Intake"}
                    </DialogTitle>
                    <DialogDescription>
                        Add an admission intake period (e.g. Fall, Spring).
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={intake?.name}
                            placeholder="e.g. Fall 2024"
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
                                defaultValue={intake?.start_date}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input
                                id="end_date"
                                name="end_date"
                                type="date"
                                defaultValue={intake?.end_date}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_open"
                            name="is_open"
                            defaultChecked={intake?.is_open ?? true}
                        />
                        <Label htmlFor="is_open">Open for Applications</Label>
                    </div>
                    <DialogFooter className="flex justify-between sm:justify-between">
                        {intake && (
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


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h1>Title</h1>
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
