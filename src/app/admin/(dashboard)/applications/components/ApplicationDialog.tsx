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
import { updateApplicationStatus, updateApplicationStage, updatePaymentStatus, addComment } from "../actions";
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

    async function handleStageChange(value: string) {
        setIsLoading(true);
        try {
            const result = await updateApplicationStage(application.id, value);
            if (result?.error) toast.error(result.error);
            else toast.success("Stage updated");
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePaymentChange(value: string) {
        setIsLoading(true);
        try {
            const result = await updatePaymentStatus(application.id, value);
            if (result?.error) toast.error(result.error);
            else toast.success("Payment status updated");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAddComment() {
        if (!comment.trim()) return;
        setIsLoading(true);
        try {
            const result = await addComment(application.id, comment);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Comment added");
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
                    {/* Status Controls */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select defaultValue={application.status} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Pipeline Stage</Label>
                            <Select defaultValue={application.stage || "new"} onValueChange={handleStageChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="screening">Screening</SelectItem>
                                    <SelectItem value="interview">Interview</SelectItem>
                                    <SelectItem value="offer">Offer Sent</SelectItem>
                                    <SelectItem value="enrolled">Enrolled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Payment</Label>
                            <Select defaultValue={application.payment_status} onValueChange={handlePaymentChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" /> Comments
                        </h4>
                        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                            {application.comments && application.comments.length > 0 ? (
                                <div className="space-y-4">
                                    {application.comments.map((c: any, i: number) => (
                                        <div key={i} className="bg-muted p-3 rounded-lg text-sm">
                                            <p>{c.text}</p>
                                            <span className="text-xs text-muted-foreground mt-1 block">
                                                {new Date(c.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No comments yet.
                                </p>
                            )}
                        </ScrollArea>
                        <div className="flex gap-2">
                            <Textarea
                                placeholder="Add a note..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[80px]"
                            />
                            <Button
                                onClick={handleAddComment}
                                disabled={isLoading || !comment.trim()}
                                className="self-end"
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
