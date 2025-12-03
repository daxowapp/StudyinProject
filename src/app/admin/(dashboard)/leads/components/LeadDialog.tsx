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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { updateLeadStatus, deleteLead } from "../actions";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

interface LeadDialogProps {
    lead: any;
    trigger?: React.ReactNode;
}

export function LeadDialog({ lead, trigger }: LeadDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleStatusChange(value: string) {
        setIsLoading(true);
        try {
            const result = await updateLeadStatus(lead.id, value);
            if (result?.error) toast.error(result.error);
            else toast.success("Status updated");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure?")) return;

        setIsLoading(true);
        try {
            const result = await deleteLead(lead.id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Lead deleted");
                setOpen(false);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Lead</DialogTitle>
                    <DialogDescription>
                        Manage lead status and details.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Name</Label>
                            <p className="font-medium">{lead.name}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Email</Label>
                            <p className="font-medium">{lead.email}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Phone</Label>
                            <p className="font-medium">{lead.phone || "-"}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Country</Label>
                            <p className="font-medium">{lead.country || "-"}</p>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <Label className="text-muted-foreground">Study Interest</Label>
                            <p className="font-medium capitalize">{lead.study_interest || "-"}</p>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <Label className="text-muted-foreground">Message</Label>
                            <p className="text-muted-foreground italic">{lead.message || "No message"}</p>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select defaultValue={lead.status} onValueChange={handleStatusChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="qualified">Qualified</SelectItem>
                                <SelectItem value="converted">Converted</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter className="flex justify-between sm:justify-between">
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button type="button" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
