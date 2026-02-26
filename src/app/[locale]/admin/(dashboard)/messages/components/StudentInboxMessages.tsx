'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Mail,
    MailOpen,
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

interface Attachment {
    id: string;
    file_url: string;
    file_type: string;
    mime_type: string;
    file_name: string;
    file_size: number;
}

interface Message {
    id: string;
    application_id: string;
    subject: string;
    message: string;
    message_type: string;
    is_read: boolean;
    requires_action: boolean;
    action_completed: boolean;
    created_at: string;
    message_attachments: Attachment[];
}

interface StudentInboxMessagesProps {
    messages: Message[];
}

export function StudentInboxMessages({ messages }: StudentInboxMessagesProps) {
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

    if (!messages || messages.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <MailOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Messages</h3>
                    <p className="text-gray-600">
                        You have no messages from the administration yet.
                    </p>
                </CardContent>
            </Card>
        );
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
                                            <span className="font-medium">Admin</span>
                                        </div>
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
                                        <p className="font-semibold text-orange-900">Action Required</p>
                                        <p className="text-sm text-orange-800">
                                            Please attend to this request as soon as possible.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {message.message_attachments && message.message_attachments.length > 0 && (
                            <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Attachments ({message.message_attachments.length})
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

                        {/* View Conversation Button */}
                        <div className="pt-4 border-t">
                            <Link href={`/dashboard/messages/${message.application_id}`}>
                                <Button className="w-full gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Reply
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
