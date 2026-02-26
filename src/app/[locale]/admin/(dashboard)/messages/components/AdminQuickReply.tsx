'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Send, Paperclip, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { sendAdminReplyWithAttachments } from '../actions';

interface AdminQuickReplyProps {
    applicationId: string;
    studentName: string;
    originalSubject: string;
}

interface AttachmentFile {
    file: File;
    preview?: string;
}

export function AdminQuickReply({ applicationId, studentName, originalSubject }: AdminQuickReplyProps) {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('general');
    const [requiresAction, setRequiresAction] = useState(false);
    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const maxSize = 10 * 1024 * 1024;

        const validFiles = files.filter(file => {
            if (file.size > maxSize) {
                toast.error(`${file.name} is too large. Max size is 10MB`);
                return false;
            }
            return true;
        });

        const newAttachments: AttachmentFile[] = validFiles.map(file => {
            const attachment: AttachmentFile = { file };
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
        if (!message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('applicationId', applicationId);
            formData.append('subject', `Re: ${originalSubject}`);
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
                setMessage('');
                setMessageType('general');
                setRequiresAction(false);
                setAttachments([]);
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
        <div className="bg-white rounded-lg border p-4 space-y-4">
            <h4 className="font-semibold text-sm text-gray-700">Reply to {studentName}</h4>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <Label className="text-xs">Message Type</Label>
                    <Select value={messageType} onValueChange={setMessageType}>
                        <SelectTrigger className="h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="document_request">Document Request</SelectItem>
                            <SelectItem value="payment_request">Payment Request</SelectItem>
                            <SelectItem value="status_update">Status Update</SelectItem>
                            <SelectItem value="acceptance_letter">Acceptance Letter</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={`requiresAction-${applicationId}`}
                            checked={requiresAction}
                            onCheckedChange={(checked) => setRequiresAction(checked as boolean)}
                        />
                        <Label htmlFor={`requiresAction-${applicationId}`} className="text-xs cursor-pointer">
                            Requires action
                        </Label>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="resize-none"
                />
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
                <div className="space-y-2">
                    {attachments.map((attachment, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm"
                        >
                            <div className="flex items-center gap-2">
                                {attachment.preview ? (
                                    <Image src={attachment.preview} alt="" width={32} height={32} className="object-cover rounded" unoptimized />
                                ) : (
                                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                        {getFileIcon(attachment.file.type)}
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-xs">{attachment.file.name}</p>
                                    <p className="text-xs text-gray-500">{(attachment.file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttachment(index)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <Input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id={`file-upload-${applicationId}`}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById(`file-upload-${applicationId}`)?.click()}
                >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    size="sm"
                    className="flex-1"
                >
                    <Send className="w-4 h-4 mr-2" />
                    {isLoading ? 'Sending...' : 'Send Reply'}
                </Button>
            </div>
        </div>
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
