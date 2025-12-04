'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    CreditCard,
    CheckCircle2,
    AlertCircle,
    Download,
    Image as ImageIcon,
    File,
    User,
    Shield
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AdminMessageReplyWithAttachments } from './AdminMessageReplyWithAttachments';

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
    message_attachments?: Array<{
        id: string;
        file_name: string;
        file_url: string;
        file_size: number;
        file_type: string;
        mime_type: string;
    }>;
}

interface ConversationThreadProps {
    messages: Message[];
    applicationId: string;
    studentName: string;
}

export function ConversationThread({ messages, applicationId, studentName }: ConversationThreadProps) {
    const getFileIcon = (fileType: string, mimeType: string) => {
        if (mimeType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileType?.toLowerCase())) {
            return <ImageIcon className="w-4 h-4 text-blue-600" />;
        }
        if (['pdf'].includes(fileType?.toLowerCase()) || mimeType === 'application/pdf') {
            return <FileText className="w-4 h-4 text-red-600" />;
        }
        if (['doc', 'docx'].includes(fileType?.toLowerCase()) || mimeType?.includes('word')) {
            return <FileText className="w-4 h-4 text-blue-600" />;
        }
        return <File className="w-4 h-4 text-gray-600" />;
    };

    const getMessageTypeIcon = (type: string) => {
        switch (type) {
            case 'document_request':
                return <FileText className="w-4 h-4" />;
            case 'payment_request':
                return <CreditCard className="w-4 h-4" />;
            case 'status_update':
            case 'acceptance_letter':
                return <CheckCircle2 className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const getMessageTypeBadge = (type: string) => {
        const badges: Record<string, { label: string; className: string }> = {
            document_request: { label: 'Document Request', className: 'bg-yellow-100 text-yellow-800' },
            payment_request: { label: 'Payment Request', className: 'bg-blue-100 text-blue-800' },
            status_update: { label: 'Status Update', className: 'bg-purple-100 text-purple-800' },
            acceptance_letter: { label: 'Acceptance Letter', className: 'bg-green-100 text-green-800' },
            rejection_notice: { label: 'Rejection Notice', className: 'bg-red-100 text-red-800' },
            interview_invitation: { label: 'Interview Invitation', className: 'bg-indigo-100 text-indigo-800' },
            additional_info_request: { label: 'Info Request', className: 'bg-orange-100 text-orange-800' },
            general: { label: 'General', className: 'bg-gray-100 text-gray-800' },
        };
        return badges[type] || badges.general;
    };

    return (
        <div className="space-y-4">
            {/* Messages Thread */}
            <div className="space-y-4">
                {messages.map((message) => {
                    const isAdmin = message.sender_type === 'admin';
                    const badge = getMessageTypeBadge(message.message_type);

                    return (
                        <div
                            key={message.id}
                            className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[75%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                                {/* Sender Info */}
                                <div className={`flex items-center gap-2 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAdmin ? 'bg-blue-100' : 'bg-green-100'
                                        }`}>
                                        {isAdmin ? (
                                            <Shield className="w-4 h-4 text-blue-600" />
                                        ) : (
                                            <User className="w-4 h-4 text-green-600" />
                                        )}
                                    </div>
                                    <div className={`text-sm ${isAdmin ? 'text-right' : 'text-left'}`}>
                                        <div className="font-semibold text-gray-900">
                                            {isAdmin ? 'Admin' : studentName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>

                                {/* Message Card */}
                                <Card className={`p-4 ${isAdmin
                                        ? 'bg-blue-50 border-blue-200'
                                        : 'bg-white border-gray-200'
                                    }`}>
                                    {/* Message Type & Status Badges */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <Badge className={badge.className}>
                                            {getMessageTypeIcon(message.message_type)}
                                            <span className="ml-1">{badge.label}</span>
                                        </Badge>

                                        {message.requires_action && (
                                            <Badge className={message.action_completed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {message.action_completed ? 'Action Completed' : 'Action Required'}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Subject */}
                                    <h4 className="font-semibold text-gray-900 mb-2">{message.subject}</h4>

                                    {/* Message Content */}
                                    <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>

                                    {/* Attachments */}
                                    {message.message_attachments && message.message_attachments.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="text-sm font-medium text-gray-700 mb-2">
                                                📎 Attachments ({message.message_attachments.length})
                                            </div>
                                            <div className="space-y-2">
                                                {message.message_attachments.map((attachment) => (
                                                    <a
                                                        key={attachment.id}
                                                        href={attachment.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
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
                                                        <Download className="w-4 h-4 text-blue-600 shrink-0" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Reply Form */}
            <div className="sticky bottom-0 bg-white border-t pt-4 mt-8">
                <AdminMessageReplyWithAttachments
                    applicationId={applicationId}
                    studentName={studentName}
                />
            </div>
        </div>
    );
}
