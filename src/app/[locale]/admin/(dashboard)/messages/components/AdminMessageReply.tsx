'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { sendAdminReply } from '../actions';

interface AdminMessageReplyProps {
    applicationId: string;
    studentName: string;
    messageId: string;
}

export function AdminMessageReply({ applicationId, studentName, messageId }: AdminMessageReplyProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('general');
    const [requiresAction, setRequiresAction] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!subject.trim() || !message.trim()) {
            toast.error('Please enter both subject and message');
            return;
        }

        setIsLoading(true);
        try {
            const result = await sendAdminReply(
                applicationId,
                subject,
                message,
                messageType,
                requiresAction
            );

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Reply sent successfully!');
                setSubject('');
                setMessage('');
                setMessageType('general');
                setRequiresAction(false);
                setIsOpen(false);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to send reply');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                variant="default"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="gap-2"
            >
                <Send className="w-4 h-4" />
                Reply to {studentName}
            </Button>
        );
    }

    return (
        <Card className="mt-4 border-l-4 border-l-primary">
            <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Reply to {studentName}</h4>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setIsOpen(false);
                            setSubject('');
                            setMessage('');
                            setMessageType('general');
                            setRequiresAction(false);
                        }}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label>Message Type</Label>
                    <Select value={messageType} onValueChange={setMessageType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">General Message</SelectItem>
                            <SelectItem value="document_request">Document Request</SelectItem>
                            <SelectItem value="status_update">Status Update</SelectItem>
                            <SelectItem value="additional_info_request">Additional Info Request</SelectItem>
                            <SelectItem value="acceptance_letter">Acceptance Letter</SelectItem>
                            <SelectItem value="rejection_notice">Rejection Notice</SelectItem>
                            <SelectItem value="interview_invitation">Interview Invitation</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                        placeholder="Message subject..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                        placeholder="Type your reply here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[150px]"
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id={`requires-action-${messageId}`}
                        checked={requiresAction}
                        onChange={(e) => setRequiresAction(e.target.checked)}
                        className="rounded border-gray-300"
                        disabled={isLoading}
                    />
                    <Label htmlFor={`requires-action-${messageId}`} className="text-sm font-normal cursor-pointer">
                        This message requires action from the student
                    </Label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setIsOpen(false);
                            setSubject('');
                            setMessage('');
                            setMessageType('general');
                            setRequiresAction(false);
                        }}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !subject.trim() || !message.trim()}
                        className="gap-2"
                    >
                        <Send className="w-4 h-4" />
                        {isLoading ? 'Sending...' : 'Send Reply'}
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                    Student will receive this message in their dashboard and via email.
                </p>
            </CardContent>
        </Card>
    );
}
