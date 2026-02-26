"use client";

import { Button } from "@/components/ui/button";
import { Award, Home, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UniversityActionsProps {
    id: string;
}

export function UniversityActions({ id }: UniversityActionsProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const supabase = createClient();
        const { error } = await supabase
            .from("universities")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Error deleting university: " + error.message);
            setIsDeleting(false);
        } else {
            toast.success("University deleted");
            router.refresh();
            setShowDeleteDialog(false);
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/universities/${id}/scholarships`}>
                    <Button variant="outline" size="sm">
                        <Award className="mr-2 h-4 w-4" />
                        Scholarships
                    </Button>
                </Link>
                <Link href={`/admin/universities/${id}/accommodation`}>
                    <Button variant="outline" size="sm">
                        <Home className="mr-2 h-4 w-4" />
                        Accommodation
                    </Button>
                </Link>
                <Link href={`/admin/universities/${id}`}>
                    <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                </Link>
                <Button
                    variant="destructive"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setShowDeleteDialog(true)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the university
                            and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
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
