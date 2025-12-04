'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Mail,
    FileText,
    CreditCard,
    CheckCircle2,
    Calendar,
    User,
    ArrowRight,
    Image as ImageIcon,
    File,
    Download,
    MessageSquare
} from 'lucide-react';

interface SentMessagesProps {
    messages: {
        id: string;
        message_type: string;
        subject: string;
        message: string;
        created_at: string;
        is_read: boolean;
        requires_action: boolean;
        action_completed: boolean;
        application_id: string;
        application?: {
            student_name: string;
            university_program?: {
                program_catalog?: {
                    title: string;
                };
            };
        };
        message_attachments?: {
            id: string;
            file_name: string;
            file_url: string;
            file_size: number;
            file_type: string;
            mime_type: string;
        }[];
    }[];
}

export function SentMessages({ messages }: SentMessagesProps) {
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

    if (!messages || messages.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sent Messages</h3>
                    <p className="text-gray-600">
                        You haven&apos;t sent any messages yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {messages.map((message) => (
                <Card
                    key={message.id}
                    className="bg-white hover:shadow-md transition-all"
                >
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="mt-1">{getMessageIcon(message.message_type)}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <CardTitle className="text-lg">{message.subject}</CardTitle>
                                        {message.requires_action && (
                                            <Badge className={message.action_completed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                                                {message.action_completed ? 'Action Completed' : 'Action Required'}
                                            </Badge>
                                        )}
                                        {message.is_read ? (
                                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                                Read by Student
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-gray-500">
                                                Unread
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription className="flex items-center gap-2 flex-wrap text-sm">
                                        <div className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                            <User className="w-3 h-3" />
                                            <span className="font-medium">To: {message.application?.student_name}</span>
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

                        {message.message_attachments && message.message_attachments.length > 0 && (
                            <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Attachments Sent ({message.message_attachments.length})
                                </p>
                                <div className="grid gap-2">
                                    {message.message_attachments?.map((attachment, index) => (
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
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 pt-2 border-t flex-wrap">
                            <Link href={`/admin/applications/${message.application_id}`}>
                                <Button variant="outline" size="sm">
                                    <ArrowRight className="w-4 h-4 mr-2" />
                                    View Application
                                </Button>
                            </Link>
                            <Link href={`/admin/messages/${message.application_id}`}>
                                <Button variant="outline" size="sm">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    View Thread
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
