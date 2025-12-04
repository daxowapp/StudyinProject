'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Send, Paperclip, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { sendAdminReplyWithAttachments } from '../actions';

interface AdminMessageReplyWithAttachmentsProps {
    applicationId: string;
    studentName: string;
}

interface AttachmentFile {
    file: File;
    preview?: string;
}

export function AdminMessageReplyWithAttachments({
    applicationId,
    studentName
}: AdminMessageReplyWithAttachmentsProps) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('general');
    const [requiresAction, setRequiresAction] = useState(false);
    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const maxSize = 10 * 1024 * 1024; // 10MB

        const validFiles = files.filter(file => {
            if (file.size > maxSize) {
                toast.error(`${file.name} is too large. Max size is 10MB`);
                return false;
            }
            return true;
        });

        const newAttachments: AttachmentFile[] = validFiles.map(file => {
            const attachment: AttachmentFile = { file };

            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    attachment.preview = reader.result as string;
                };
                reader.readAsDataURL(file);
            }

            return attachment;
        });

        setAttachments(prev => [...prev, ...newAttachments]);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
        if (fileType.includes('pdf')) return <FileText className="w-4 h-4" />;
        return <File className="w-4 h-4" />;
    };

    const handleSubmit = async () => {
        if (!subject.trim() || !message.trim()) {
            toast.error('Please enter both subject and message');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('applicationId', applicationId);
            formData.append('subject', subject);
            formData.append('message', message);
            formData.append('messageType', messageType);
            formData.append('requiresAction', requiresAction.toString());

            attachments.forEach((attachment, index) => {
                formData.append(`file_${index}`, attachment.file);
            });

            const result = await sendAdminReplyWithAttachments(formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Reply sent successfully!');
                setSubject('');
                setMessage('');
                setMessageType('general');
                setRequiresAction(false);
                setAttachments([]);

                // Refresh the page to show new message
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to send reply');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6 space-y-4">
                <h4 className="font-semibold text-lg">Reply to {studentName}</h4>

                <div className="space-y-2">
                    <Label>Message Type</Label>
                    <Select value={messageType} onValueChange={setMessageType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="document_request">Document Request</SelectItem>
                            <SelectItem value="payment_request">Payment Request</SelectItem>
                            <SelectItem value="status_update">Status Update</SelectItem>
                            <SelectItem value="acceptance_letter">Acceptance Letter</SelectItem>
                            <SelectItem value="rejection_notice">Rejection Notice</SelectItem>
                            <SelectItem value="interview_invitation">Interview Invitation</SelectItem>
                            <SelectItem value="additional_info_request">Additional Info Request</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter message subject"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows={5}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="requiresAction"
                        checked={requiresAction}
                        onCheckedChange={(checked) => setRequiresAction(checked as boolean)}
                    />
                    <Label htmlFor="requiresAction" className="cursor-pointer">
                        Requires action from student
                    </Label>
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                    <Label>Attachments</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="gap-2"
                        >
                            <Paperclip className="w-4 h-4" />
                            Attach Files
                        </Button>
                        <span className="text-sm text-gray-500">
                            Max 10MB per file
                        </span>
                    </div>

                    {attachments.length > 0 && (
                        <div className="space-y-2 mt-2">
                            {attachments.map((attachment, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                >
                                    <div className="flex items-center gap-3">
                                        {attachment.preview ? (
                                            <Image
                                                src={attachment.preview}
                                                alt={attachment.file.name}
                                                width={40}
                                                height={40}
                                                className="object-cover rounded"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                                {getFileIcon(attachment.file.type)}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium">{attachment.file.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {(attachment.file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeAttachment(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-2 pt-4">
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 gap-2"
                    >
                        <Send className="w-4 h-4" />
                        {isLoading ? 'Sending...' : 'Send Reply'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
