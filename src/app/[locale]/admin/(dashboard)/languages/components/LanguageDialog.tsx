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
import { useState } from "react";
import { createLanguage, updateLanguage, deleteLanguage } from "../actions";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface LanguageDialogProps {
    language?: {
        id: string;
        name: string;
        code: string;
    };
}

export function LanguageDialog({ language }: LanguageDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            const result = language
                ? await updateLanguage(language.id, formData)
                : await createLanguage(formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(language ? "Language updated" : "Language created");
                setOpen(false);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure?")) return;

        if (!language) return;

        setIsLoading(true);
        try {
            const result = await deleteLanguage(language.id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Language deleted");
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
                {language ? (
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Language
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {language ? "Edit Language" : "Add Language"}
                    </DialogTitle>
                    <DialogDescription>
                        Add a language option for programs.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={language?.name}
                            placeholder="e.g. English"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            name="code"
                            defaultValue={language?.code}
                            placeholder="e.g. en"
                            required
                        />
                    </div>
                    <DialogFooter className="flex justify-between sm:justify-between">
                        {language && (
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
