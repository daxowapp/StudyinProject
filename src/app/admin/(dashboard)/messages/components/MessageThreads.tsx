'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ChevronDown,
    ChevronRight,
    FileText,
    AlertCircle,
    Download,
    Image as ImageIcon,
    File,
    User,
    Shield,
    Paperclip,
    Mail
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AdminQuickReply } from './AdminQuickReply';

interface Message {
    id: string;
    sender_type: 'admin' | 'student';
    message_type: string;
    subject: string;
    message: string;
    created_at: string;
    is_read: boolean;
    requires_action: boolean;
    action_completed: boolean;
    application_id: string;
    message_attachments?: Array<{
        id: string;
        file_name: string;
        file_url: string;
        file_size: number;
        file_type: string;
        mime_type: string;
    }>;
    application?: {
        student_name: string;
        student_email: string;
    };
}

interface MessageThread {
    subject: string;
    applicationId: string;
    studentName: string;
    messages: Message[];
    latestMessage: Message;
    unreadCount: number;
    hasActionRequired: boolean;
}

interface MessageThreadsProps {
    messages: Message[];
}

export function MessageThreads({ messages }: MessageThreadsProps) {
    const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

    // Group messages by application_id and subject
    const threads: MessageThread[] = [];
    const threadMap = new Map<string, Message[]>();

    messages.forEach(message => {
        const key = `${message.application_id}`;
        if (!threadMap.has(key)) {
            threadMap.set(key, []);
        }
        threadMap.get(key)!.push(message);
    });

    threadMap.forEach((msgs, key) => {
        // Sort messages by date
        msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        const latestMessage = msgs[msgs.length - 1];
        const unreadCount = msgs.filter(m => !m.is_read && m.sender_type === 'student').length;
        const hasActionRequired = msgs.some(m => m.requires_action && !m.action_completed);

        threads.push({
            subject: msgs[0].subject,
            applicationId: key,
            studentName: msgs[0].application?.student_name || 'Student',
            messages: msgs,
            latestMessage,
            unreadCount,
            hasActionRequired
        });
    });

    // Sort threads by latest message date
    threads.sort((a, b) =>
        new Date(b.latestMessage.created_at).getTime() - new Date(a.latestMessage.created_at).getTime()
    );

    const toggleThread = (applicationId: string) => {
        const newExpanded = new Set(expandedThreads);
        if (newExpanded.has(applicationId)) {
            newExpanded.delete(applicationId);
        } else {
            newExpanded.add(applicationId);
        }
        setExpandedThreads(newExpanded);
    };

    const getFileIcon = (fileType: string, mimeType: string) => {
        if (mimeType?.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-blue-600" />;
        if (mimeType === 'application/pdf') return <FileText className="w-4 h-4 text-red-600" />;
        return <File className="w-4 h-4 text-gray-600" />;
    };

    const getMessageTypeBadge = (type: string) => {
        const badges: Record<string, { label: string; className: string }> = {
            document_request: { label: 'Document Request', className: 'bg-yellow-100 text-yellow-800' },
            payment_request: { label: 'Payment Request', className: 'bg-blue-100 text-blue-800' },
            status_update: { label: 'Status Update', className: 'bg-purple-100 text-purple-800' },
            acceptance_letter: { label: 'Acceptance Letter', className: 'bg-green-100 text-green-800' },
            general: { label: 'General', className: 'bg-gray-100 text-gray-800' },
        };
        return badges[type] || badges.general;
    };

    if (threads.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Messages</h3>
                    <p className="text-gray-600">No message threads yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {threads.map((thread) => {
                const isExpanded = expandedThreads.has(thread.applicationId);
                const badge = getMessageTypeBadge(thread.latestMessage.message_type);

                return (
                    <Card key={thread.applicationId} className="overflow-hidden">
                        {/* Thread Header - Always Visible */}
                        <CardHeader
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleThread(thread.applicationId)}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    {/* Expand/Collapse Icon */}
                                    <div className="mt-1">
                                        {isExpanded ? (
                                            <ChevronDown className="w-5 h-5 text-gray-500" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5 text-gray-500" />
                                        )}
                                    </div>

                                    {/* Thread Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {thread.subject}
                                            </h3>
                                            {thread.unreadCount > 0 && (
                                                <Badge className="bg-red-500 text-white">
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

                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <User className="w-4 h-4" />
                                            <span className="font-medium">{thread.studentName}</span>
                                            <span>•</span>
                                            <span>{thread.messages.length} message{thread.messages.length > 1 ? 's' : ''}</span>
                                            <span>•</span>
                                            <span>{formatDistanceToNow(new Date(thread.latestMessage.created_at), { addSuffix: true })}</span>
                                        </div>

                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {thread.latestMessage.message}
                                        </p>
                                    </div>

                                    {/* Message Type Badge */}
                                    <Badge className={badge.className}>
                                        {badge.label}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>

                        {/* Thread Messages - Shown when expanded */}
                        {isExpanded && (
                            <CardContent className="border-t bg-gray-50 p-6 space-y-4">
                                {/* All Messages in Thread */}
                                {thread.messages.map((message, index) => {
                                    const isAdmin = message.sender_type === 'admin';

                                    return (
                                        <div key={message.id} className="space-y-2">
                                            {/* Message */}
                                            <div className={`p-4 rounded-lg ${isAdmin ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200'
                                                }`}>
                                                {/* Sender Info */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAdmin ? 'bg-blue-100' : 'bg-green-100'
                                                        }`}>
                                                        {isAdmin ? (
                                                            <Shield className="w-4 h-4 text-blue-600" />
                                                        ) : (
                                                            <User className="w-4 h-4 text-green-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm">
                                                            {isAdmin ? 'Admin' : thread.studentName}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                                        </div>
                                                    </div>
                                                    {message.requires_action && (
                                                        <Badge className={message.action_completed ? 'bg-green-100 text-green-800 ml-auto' : 'bg-red-100 text-red-800 ml-auto'}>
                                                            {message.action_completed ? '✓ Completed' : 'Action Required'}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Message Content */}
                                                <p className="text-gray-700 whitespace-pre-wrap mb-3">
                                                    {message.message}
                                                </p>

                                                {/* Attachments */}
                                                {message.message_attachments && message.message_attachments.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                            <Paperclip className="w-4 h-4" />
                                                            {message.message_attachments.length} attachment{message.message_attachments.length > 1 ? 's' : ''}
                                                        </div>
                                                        <div className="space-y-2">
                                                            {message.message_attachments.map((attachment) => (
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

                                {/* Quick Reply Form */}
                                <div className="pt-4 border-t">
                                    <AdminQuickReply
                                        applicationId={thread.applicationId}
                                        studentName={thread.studentName}
                                        originalSubject={thread.subject}
                                    />
                                </div>
                            </CardContent>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
