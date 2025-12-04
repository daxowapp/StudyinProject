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
import { submitLead } from "@/app/[locale]/(public)/download-guide/actions";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";

interface RequestInformationDialogProps {
    universityName: string;
    universityId: string;
    trigger?: React.ReactNode;
}

export function RequestInformationDialog({ universityName, universityId, trigger }: RequestInformationDialogProps) {
    const t = useTranslations('RequestInformation');
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
                toast.success(t('success'));
                setOpen(false);
            } else {
                toast.error(t('error'));
            }
        } catch {
            toast.error(t('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>{t('title')}</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>
                        {t('description', { university: universityName })}
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4 mt-4">
                    <input type="hidden" name="source" value="university_inquiry" />
                    <input type="hidden" name="universityId" value={universityId} />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">{t('firstName')} *</Label>
                            <Input id="firstName" name="firstName" required placeholder="John" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">{t('lastName')} *</Label>
                            <Input id="lastName" name="lastName" required placeholder="Doe" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{t('email')} *</Label>
                        <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">{t('phone')}</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">{t('interest')} *</Label>
                        <Select name="subject" defaultValue="admission">
                            <SelectTrigger>
                                <SelectValue placeholder={t('selectInterest')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admission">{t('interests.admission')}</SelectItem>
                                <SelectItem value="programs">{t('interests.programs')}</SelectItem>
                                <SelectItem value="scholarships">{t('interests.scholarships')}</SelectItem>
                                <SelectItem value="campus">{t('interests.campus')}</SelectItem>
                                <SelectItem value="other">{t('interests.other')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">{t('message')}</Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder={t('messagePlaceholder', { university: universityName })}
                            rows={4}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('sending')}
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                {t('submit')}
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
