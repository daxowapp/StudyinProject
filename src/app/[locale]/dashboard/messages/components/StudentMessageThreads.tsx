'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    ChevronDown,
    ChevronRight,
    User,
    Shield,
    Paperclip,
    Download,
    FileText,
    Image as ImageIcon,
    File,
    Send,
    AlertCircle,
    Clock,
    MessageSquare
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import Link from 'next/link';

interface Attachment {
    id: string;
    file_url: string;
    file_name: string;
    file_type: string;
    mime_type: string;
    file_size: number;
}

interface Message {
    id: string;
    sender_type: string;
    created_at: string;
    subject?: string;
    message: string;
    requires_action: boolean;
    action_completed: boolean;
    application_id: string;
    message_attachments?: Attachment[];
}

interface Thread {
    applicationId: string;
    programTitle: string;
    unreadCount: number;
    hasActionRequired: boolean;
    messages: Message[];
    latestMessage: Message;
}

interface StudentMessageThreadsProps {
    threads: Thread[];
}

import { markAllMessagesAsRead, sendReply } from '../actions';

// ... (imports remain the same)

export function StudentMessageThreads({ threads }: StudentMessageThreadsProps) {
    const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSending, setIsSending] = useState(false);

    const toggleThread = async (applicationId: string) => {
        const newExpanded = new Set(expandedThreads);
        const isExpanding = !newExpanded.has(applicationId);

        if (newExpanded.has(applicationId)) {
            newExpanded.delete(applicationId);
        } else {
            newExpanded.add(applicationId);
        }
        setExpandedThreads(newExpanded);

        // Mark messages as read when expanding
        if (isExpanding) {
            await markAllMessagesAsRead([applicationId]);
        }
    };

    const handleSendReply = async (applicationId: string) => {
        if (!replyText.trim()) {
            toast.error('Please enter a message');
            return;
        }

        setIsSending(true);
        try {
            const formData = new FormData();
            formData.append('applicationId', applicationId);
            formData.append('message', replyText);
            if (replyingTo) {
                formData.append('originalMessageId', replyingTo);
            }

            const result = await sendReply(formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Reply sent successfully!');
                setReplyText('');
                setReplyingTo(null);
                // No need to reload, revalidatePath in action handles it
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to mark as read");
        } finally {
            setIsSending(false);
        }
    };

    const getFileIcon = (fileType: string, mimeType: string) => {
        if (mimeType?.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-blue-600" />;
        if (mimeType === 'application/pdf') return <FileText className="w-4 h-4 text-red-600" />;
        return <File className="w-4 h-4 text-gray-600" />;
    };

    return (
        <div className="space-y-4">
            {threads.map((thread) => {
                const isExpanded = expandedThreads.has(thread.applicationId);

                return (
                    <Card key={thread.applicationId} className="overflow-hidden">
                        {/* Thread Header */}
                        <CardHeader
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleThread(thread.applicationId)}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="mt-1">
                                        {isExpanded ? (
                                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <h3 className="font-semibold text-lg">{thread.programTitle}</h3>
                                            {thread.unreadCount > 0 && (
                                                <Badge className="bg-blue-600 text-white">
                                                    {thread.unreadCount} new
                                                </Badge>
                                            )}
                                            {thread.hasActionRequired && (
                                                <Badge className="bg-orange-100 text-orange-800">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    Action Required
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MessageSquare className="w-4 h-4" />
                                            <span>{thread.messages.length} message{thread.messages.length > 1 ? 's' : ''}</span>
                                            <span>•</span>
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDistanceToNow(new Date(thread.latestMessage.created_at), { addSuffix: true })}</span>
                                        </div>

                                        {!isExpanded && (
                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                {thread.latestMessage.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        {/* Thread Messages */}
                        {isExpanded && (
                            <CardContent className="border-t bg-muted/30 p-6 space-y-4">
                                {thread.messages.map((message: Message) => {
                                    const isAdmin = message.sender_type === 'admin';

                                    return (
                                        <div key={message.id} className="space-y-2">
                                            <div className={`p-4 rounded-lg ${isAdmin ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200'
                                                }`}>
                                                {/* Message Header */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAdmin ? 'bg-blue-100' : 'bg-green-100'
                                                        }`}>
                                                        {isAdmin ? (
                                                            <Shield className="w-4 h-4 text-blue-600" />
                                                        ) : (
                                                            <User className="w-4 h-4 text-green-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-sm">
                                                            {isAdmin ? 'Admissions Team' : 'You'}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                                        </div>
                                                    </div>
                                                    {message.requires_action && (
                                                        <Badge className={message.action_completed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                            {message.action_completed ? '✓ Completed' : 'Action Required'}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Subject */}
                                                {message.subject && (
                                                    <h4 className="font-semibold mb-2">{message.subject}</h4>
                                                )}

                                                {/* Message Content */}
                                                <p className="text-gray-700 whitespace-pre-wrap">
                                                    {message.message}
                                                </p>

                                                {/* Action Required Alert */}
                                                {message.requires_action && !message.action_completed && (
                                                    <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-orange-900 text-sm">Action Required</p>
                                                                <p className="text-sm text-orange-800">
                                                                    Please respond to this message or complete the requested action.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Link href={`/dashboard/applications/${message.application_id}`}>
                                                            <Button className="w-full mt-3 bg-orange-600 hover:bg-orange-700">
                                                                Take Action
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                )}

                                                {/* Attachments */}
                                                {message.message_attachments && message.message_attachments.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <Paperclip className="w-4 h-4" />
                                                            {message.message_attachments.length} attachment{message.message_attachments.length > 1 ? 's' : ''}
                                                        </div>
                                                        <div className="space-y-2">
                                                            {message.message_attachments?.map((attachment: Attachment) => (
                                                                <a
                                                                    key={attachment.id}
                                                                    href={attachment.file_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    download
                                                                    className="flex items-center gap-3 p-2 bg-white rounded border hover:border-blue-400 hover:shadow-sm transition-all group"
                                                                >
                                                                    <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center shrink-0">
                                                                        {getFileIcon(attachment.file_type, attachment.mime_type)}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                                                                            {attachment.file_name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {attachment.file_type?.toUpperCase()} • {(attachment.file_size / 1024).toFixed(1)} KB
                                                                        </p>
                                                                    </div>
                                                                    <Download className="w-4 h-4 text-blue-600 shrink-0" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Quick Reply */}
                                <div className="pt-4 border-t">
                                    {replyingTo === thread.applicationId ? (
                                        <div className="space-y-3">
                                            <Textarea
                                                placeholder="Type your reply..."
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                rows={4}
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handleSendReply(thread.applicationId)}
                                                    disabled={isSending || !replyText.trim()}
                                                    className="gap-2"
                                                >
                                                    <Send className="w-4 h-4" />
                                                    {isSending ? 'Sending...' : 'Send Reply'}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setReplyingTo(null);
                                                        setReplyText('');
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => setReplyingTo(thread.applicationId)}
                                            variant="outline"
                                            className="w-full gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            Reply to Admissions Team
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        )
                        }
                    </Card>
                );
            })}
        </div >
    );
}
