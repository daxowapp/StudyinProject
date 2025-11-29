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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { updateApplicationStatus, addAdminNote } from "../actions";
import { toast } from "sonner";
import { Eye, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApplicationDialogProps {
    application: any;
}

export function ApplicationDialog({ application }: ApplicationDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState("");

    async function handleStatusChange(value: string) {
        setIsLoading(true);
        try {
            const result = await updateApplicationStatus(application.id, value);
            if (result?.error) toast.error(result.error);
            else toast.success("Status updated");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAddNote() {
        if (!comment.trim()) return;
        setIsLoading(true);
        try {
            const result = await addAdminNote(application.id, comment);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Note added");
                setComment("");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" /> View Details
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Application Details</DialogTitle>
                    <DialogDescription>
                        Manage application status and pipeline.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Application Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                            <Label className="text-muted-foreground">Student Name</Label>
                            <p className="font-medium">{application.student_name}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Email</Label>
                            <p className="font-medium">{application.student_email}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Phone</Label>
                            <p className="font-medium">{application.student_phone || 'N/A'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Country</Label>
                            <p className="font-medium">{application.student_country || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Status Control */}
                    <div className="space-y-2">
                        <Label>Application Status</Label>
                        <Select defaultValue={application.status} onValueChange={handleStatusChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="pending_documents">Pending Documents</SelectItem>
                                <SelectItem value="pending_payment">Pending Payment</SelectItem>
                                <SelectItem value="submitted">Submitted</SelectItem>
                                <SelectItem value="under_review">Under Review</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="withdrawn">Withdrawn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Admin Notes Section */}
                    <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" /> Admin Notes
                        </h4>
                        {application.admin_notes && (
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm whitespace-pre-wrap">{application.admin_notes}</p>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <Textarea
                                placeholder="Add or update admin notes..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[100px]"
                            />
                            <Button
                                onClick={handleAddNote}
                                disabled={isLoading || !comment.trim()}
                                className="self-end"
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
