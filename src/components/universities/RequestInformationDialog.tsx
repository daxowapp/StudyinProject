"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitLead } from "@/app/(public)/download-guide/actions";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

interface RequestInformationDialogProps {
    universityName: string;
    universityId: string;
    trigger?: React.ReactNode;
}

export function RequestInformationDialog({ universityName, universityId, trigger }: RequestInformationDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            // Append university info to message if needed, or handle in backend
            // For now, we'll just send it as a standard lead with source 'university_inquiry'
            // and maybe append the university name to the subject or message

            const result = await submitLead(formData);

            if (result.success) {
                toast.success("Request sent successfully! We will contact you soon.");
                setOpen(false);
            } else {
                toast.error("Failed to send request. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Request Information</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Request Information</DialogTitle>
                    <DialogDescription>
                        Get more details about {universityName}. Fill out the form below.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4 mt-4">
                    <input type="hidden" name="source" value="university_inquiry" />
                    <input type="hidden" name="universityId" value={universityId} />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input id="firstName" name="firstName" required placeholder="John" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input id="lastName" name="lastName" required placeholder="Doe" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Interest *</Label>
                        <Select name="subject" defaultValue="admission">
                            <SelectTrigger>
                                <SelectValue placeholder="Select your interest" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admission">Admission Requirements</SelectItem>
                                <SelectItem value="programs">Available Programs</SelectItem>
                                <SelectItem value="scholarships">Scholarship Opportunities</SelectItem>
                                <SelectItem value="campus">Campus Life</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder={`I am interested in studying at ${universityName}...`}
                            rows={4}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Request
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
