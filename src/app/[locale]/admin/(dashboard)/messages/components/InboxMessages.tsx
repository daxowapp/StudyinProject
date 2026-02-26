'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Mail,
    MailOpen,
    Clock,
    AlertCircle,
    FileText,
    CreditCard,
    CheckCircle2,
    Calendar,
    User,
    ArrowRight,
    Image as ImageIcon,
    File,
    Download,
    MessageSquare,
} from 'lucide-react';

import { markMessageAsRead } from '../actions';
import { toast } from 'sonner';

interface Attachment {
    id: string;
    file_name: string;
    file_url: string;
    file_size: number;
    file_type: string;
    mime_type: string;
}

interface Message {
    id: string;
    message_type: string;
    subject: string;
    message: string;
    created_at: string;
    is_read: boolean;
    requires_action: boolean;
    action_completed: boolean;
    action_type?: string;
    action_deadline?: string;
    application_id: string;
    application?: {
        student_name: string;
        student_email: string;
        university_program?: {
            program_catalog?: {
                title: string;
            };
        };
    };
    message_attachments?: Attachment[];
}

interface InboxMessagesProps {
    messages: Message[];
}

export function InboxMessages({ messages }: InboxMessagesProps) {
    const getFileIcon = (fileType: string, mimeType: string) => {
        if (mimeType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileType?.toLowerCase())) {
            return <ImageIcon className="w-5 h-5 text-blue-600" />;
        }
        if (['pdf'].includes(fileType?.toLowerCase()) || mimeType === 'application/pdf') {
            return <FileText className="w-5 h-5 text-red-600" />;
        }
        if (['doc', 'docx'].includes(fileType?.toLowerCase()) || mimeType?.includes('word')) {
            return <FileText className="w-5 h-5 text-blue-600" />;
        }
        return <File className="w-5 h-5 text-gray-600" />;
    };

    const getMessageIcon = (type: string) => {
        switch (type) {
            case 'document_request':
                return <FileText className="w-5 h-5 text-yellow-600" />;
            case 'payment_request':
                return <CreditCard className="w-5 h-5 text-blue-600" />;
            case 'status_update':
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'acceptance_letter':
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            default:
                return <Mail className="w-5 h-5 text-gray-600" />;
        }
    };

    const getMessageColor = (type: string, isRead: boolean) => {
        const baseColor = !isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white border-l-4 border-l-gray-200';
        return baseColor;
    };

    const handleMarkAsRead = async (messageId: string) => {
        const result = await markMessageAsRead(messageId);
        if (result.error) {
            toast.error('Failed to mark as read');
        } else {
            toast.success('Marked as read');
        }
    };

    if (!messages || messages.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <MailOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Messages</h3>
                    <p className="text-gray-600">
                        No messages from students yet. Messages will appear here when students send them.
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Debug: Log messages to see structure
    if (messages.length > 0) {
        console.log('📧 Admin Inbox Messages:', messages.length);
        console.log('📎 First message attachments:', messages[0]?.message_attachments);
    }

    return (
        <div className="space-y-4">
            {messages.map((message: Message) => (
                <Card
                    key={message.id}
                    className={`${getMessageColor(message.message_type, message.is_read)} transition-all hover:shadow-md`}
                >
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="mt-1">{getMessageIcon(message.message_type)}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <CardTitle className="text-lg">{message.subject}</CardTitle>
                                        {!message.is_read && (
                                            <Badge className="bg-blue-600 text-white">New</Badge>
                                        )}
                                        {message.requires_action && !message.action_completed && (
                                            <Badge className="bg-orange-500 text-white">
                                                Action Required
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription className="flex items-center gap-2 flex-wrap text-sm">
                                        <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            <User className="w-3 h-3" />
                                            <span className="font-medium">{message.application?.student_name}</span>
                                        </div>
                                        <span>•</span>
                                        <span className="text-xs">
                                            {message.application?.university_program?.program_catalog?.title}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 text-xs">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(message.created_at).toLocaleString()}
                                        </span>
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{message.message}</p>
                        </div>

                        {message.requires_action && !message.action_completed && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-orange-900">Student Needs Action</p>
                                        <p className="text-sm text-orange-800">
                                            {message.action_type === 'upload_document' && 'Waiting for document upload'}
                                            {message.action_type === 'make_payment' && 'Waiting for payment'}
                                            {message.action_type === 'respond' && 'Waiting for response'}
                                        </p>
                                        {message.action_deadline && (
                                            <p className="text-sm text-orange-800 mt-1 flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                Deadline: {new Date(message.action_deadline).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {message.message_attachments && message.message_attachments.length > 0 && (
                            <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Student Attachments ({message.message_attachments.length})
                                </p>
                                <div className="grid gap-2">
                                    {message.message_attachments.map((attachment: Attachment, index: number) => (
                                        <a
                                            key={attachment.id || index}
                                            href={attachment.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                                    {getFileIcon(attachment.file_type, attachment.mime_type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600">
                                                        {attachment.file_name}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span>{attachment.file_type?.toUpperCase() || 'FILE'}</span>
                                                        {attachment.file_size && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{(attachment.file_size / 1024).toFixed(1)} KB</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Download className="w-4 h-4 text-blue-600 shrink-0" />
                                                <ArrowRight className="w-4 h-4 text-blue-600 shrink-0 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 pt-2 border-t flex-wrap">
                            {!message.is_read && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(message.id)}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Mark as Read
                                </Button>
                            )}
                            <Link href={`/admin/applications/${message.application_id}`}>
                                <Button variant="outline" size="sm">
                                    <ArrowRight className="w-4 h-4 mr-2" />
                                    View Application
                                </Button>
                            </Link>
                            <Link href={`mailto:${message.application?.student_email}`}>
                                <Button variant="outline" size="sm">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email Student
                                </Button>
                            </Link>
                        </div>

                        {/* View Conversation Button */}
                        <div className="pt-4 border-t">
                            <Link href={`/admin/messages/${message.application_id}`}>
                                <Button className="w-full gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    View Full Conversation & Reply
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ))}
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
