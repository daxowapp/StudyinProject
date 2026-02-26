import { useState } from 'react';
import { sendAdminReply } from '../actions';
import { useTranslations } from 'next-intl';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ChevronDown,
    ChevronRight,
    AlertCircle,
    Shield,
    User,
    Reply,
    X,
    Send,
    Quote,
    Download,
    Image as ImageIcon,
    FileText,
    File
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Interfaces
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
    parent_message_id?: string;
}

interface MessageThread {
    subject: string;
    applicationId: string;
    messages: Message[];
    latestMessage: Message;
    unreadCount: number;
    hasActionRequired: boolean;
}

interface StudentMessageThreadsProps {
    messages: Message[];
    applicationId: string;
}

export function StudentMessageThreads({ messages, applicationId }: StudentMessageThreadsProps) {
    const t = useTranslations('Messages');
    const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
    const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSending, setIsSending] = useState(false);

    // ... (grouping logic remains same)

    // ... (toggleThread, getFileIcon, getMessageTypeBadge remain same)

    // Group messages by subject
    const threads: MessageThread[] = [];
    const threadMap = new Map<string, Message[]>();

    messages.forEach(message => {
        const key = message.subject;
        if (!threadMap.has(key)) {
            threadMap.set(key, []);
        }
        threadMap.get(key)!.push(message);
    });

    threadMap.forEach((msgs, key) => {
        msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        const latestMessage = msgs[msgs.length - 1];
        // For admin, unread messages are from student
        const unreadCount = msgs.filter(m => !m.is_read && m.sender_type === 'student').length;
        const hasActionRequired = msgs.some(m => m.requires_action && !m.action_completed);

        threads.push({
            subject: key,
            applicationId: applicationId,
            messages: msgs,
            latestMessage,
            unreadCount,
            hasActionRequired
        });
    });

    threads.sort((a, b) =>
        new Date(b.latestMessage.created_at).getTime() - new Date(a.latestMessage.created_at).getTime()
    );

    const toggleThread = (subject: string) => {
        const newExpanded = new Set(expandedThreads);
        if (newExpanded.has(subject)) {
            newExpanded.delete(subject);
        } else {
            newExpanded.add(subject);
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

    const handleSendReply = async (applicationId: string) => {
        if (!replyText.trim()) {
            toast.error(t('typeReply'));
            return;
        }

        setIsSending(true);
        try {
            const formData = new FormData();
            formData.append('applicationId', applicationId);
            formData.append('message', replyText);
            formData.append('subject', `Re: ${replyingToMessage?.subject || 'Message'}`);
            formData.append('messageType', 'general');
            if (replyingToMessage) {
                formData.append('parentMessageId', replyingToMessage.id);
            }

            // Calls sendAdminReplyWithAttachments if we support attachments here, 
            // or just simple sendAdminReply. For now let's use the simple one via wrapper or direct call.
            // But sendAdminReply accepts separate args, not formData.
            // Let's call sendAdminReply directly.

            const result = await sendAdminReply(
                applicationId,
                `Re: ${replyingToMessage?.subject || 'Message'}`,
                replyText,
                'general',
                false, // requiresAction
                replyingToMessage?.id || null
            );

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(t('sending')); // Actually "Sent" but reusing key or just generic success
                setReplyText('');
                setReplyingToMessage(null);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to send reply");
        } finally {
            setIsSending(false);
        }
    };

    const renderReplyForm = (appId: string, isInline: boolean = false) => (
        <div className={`space-y-3 ${isInline ? 'mt-4 pl-8 border-l-2 border-blue-100' : 'pt-4 border-t'}`}>
            {!isInline && replyingToMessage && replyingToMessage.application_id === appId && (
                <div className="flex items-center justify-between bg-blue-50 p-2 rounded border border-blue-100 text-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Reply className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-medium text-blue-900 shrink-0">{t('replyingTo', { name: replyingToMessage.sender_type === 'admin' ? t('admin') : t('you') })}:</span>
                        <span className="text-blue-700 truncate">{replyingToMessage.message}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-blue-100"
                        onClick={() => setReplyingToMessage(null)}
                    >
                        <X className="w-4 h-4 text-blue-700" />
                    </Button>
                </div>
            )}
            <Textarea
                placeholder={t('typeReply')}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={isInline ? 3 : 4}
                autoFocus={isInline}
            />
            <div className="flex gap-2">
                <Button
                    onClick={() => handleSendReply(appId)}
                    disabled={isSending || !replyText.trim()}
                    className="gap-2"
                >
                    <Send className="w-4 h-4" />
                    {isSending ? t('sending') : t('sendReply')}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        setReplyingToMessage(null);
                        setReplyText('');
                    }}
                >
                    {t('cancel')}
                </Button>
            </div>
        </div>
    );

    // ... (render logic)

    return (
        <div className="space-y-3">
            {threads.map((thread) => {
                const isExpanded = expandedThreads.has(thread.subject);
                const badge = getMessageTypeBadge(thread.latestMessage.message_type);

                return (
                    <Card key={thread.subject} className="overflow-hidden">
                        {/* Header same as before but use translations if needed */}
                        <CardHeader
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleThread(thread.subject)}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="mt-1">
                                        {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-gray-900 truncate">{thread.subject}</h3>
                                            {thread.unreadCount > 0 && <Badge className="bg-red-500 text-white">{thread.unreadCount} new</Badge>}
                                            {thread.hasActionRequired && (
                                                <Badge className="bg-orange-100 text-orange-800">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    {t('actionRequired')}
                                                </Badge>
                                            )}
                                        </div>
                                        {/* ... other header info ... */}
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <Shield className="w-4 h-4" />
                                            <span className="font-medium">Admin</span>
                                            <span>•</span>
                                            <span>{thread.messages.length} message{thread.messages.length > 1 ? 's' : ''}</span>
                                            <span>•</span>
                                            <span>{formatDistanceToNow(new Date(thread.latestMessage.created_at), { addSuffix: true })}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2">{thread.latestMessage.message}</p>
                                    </div>
                                    <Badge className={badge.className}>{badge.label}</Badge>
                                </div>
                            </div>
                        </CardHeader>

                        {isExpanded && (
                            <CardContent className="border-t bg-gray-50 p-6 space-y-4">
                                {thread.messages.map((message) => {
                                    const isAdmin = message.sender_type === 'admin';
                                    // Find parent message (assuming threaded lookup if we had thread.messages access here which we do)
                                    const parentMessage = message.parent_message_id // Need to find in `thread.messages`
                                        ? thread.messages.find(m => m.id === message.parent_message_id)
                                        : null;

                                    return (
                                        <div key={message.id} className="space-y-2 group">
                                            <div className={`p-4 rounded-lg ${isAdmin ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200'}`}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAdmin ? 'bg-blue-100' : 'bg-green-100'}`}>
                                                        {isAdmin ? <Shield className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4 text-green-600" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-sm">{isAdmin ? 'Admin' : 'Student'}</div>
                                                        <div className="text-xs text-gray-500">{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</div>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setReplyingToMessage(message);
                                                            setReplyText('');
                                                        }}
                                                        title={t('replyTooltip')}
                                                    >
                                                        <Reply className="w-4 h-4 text-muted-foreground" />
                                                    </Button>

                                                    {message.requires_action && (
                                                        <Badge className={message.action_completed ? 'bg-green-100 text-green-800 ml-auto' : 'bg-red-100 text-red-800 ml-auto'}>
                                                            {message.action_completed ? `✓ ${t('actionCompleted')}` : t('actionRequired')}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Parent Quote */}
                                                {parentMessage && (
                                                    <div className="mb-3 pl-3 border-l-4 border-gray-300 bg-gray-50 p-2 rounded text-sm text-gray-600">
                                                        <div className="flex items-center gap-1 font-medium mb-1 text-xs">
                                                            <Quote className="w-3 h-3" />
                                                            <span>{t('replyingTo', { name: parentMessage.sender_type === 'admin' ? t('admin') : 'Student' })}</span>
                                                        </div>
                                                        <p className="line-clamp-2 italic opacity-80">{parentMessage.message}</p>
                                                    </div>
                                                )}

                                                <p className="text-gray-700 whitespace-pre-wrap mb-3">{message.message}</p>

                                                {/* Attachments rendering (keep existing logic) */}
                                                {message.message_attachments && message.message_attachments.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t">
                                                        {/* ... keep attachment map ... */}
                                                        <div className="space-y-2">
                                                            {message.message_attachments.map((attachment) => (
                                                                <a key={attachment.id} href={attachment.file_url} target="_blank" rel="noopener noreferrer" download className="flex items-center gap-3 p-2 bg-white rounded border hover:border-blue-400 hover:shadow-sm transition-all group">
                                                                    <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center shrink-0">
                                                                        {getFileIcon(attachment.file_type, attachment.mime_type)}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">{attachment.file_name}</p>
                                                                        <p className="text-xs text-gray-500">{attachment.file_type?.toUpperCase()} • {(attachment.file_size / 1024).toFixed(1)} KB</p>
                                                                    </div>
                                                                    <Download className="w-4 h-4 text-blue-600 shrink-0" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {/* INLINE REPLY FORM */}
                                            {replyingToMessage?.id === message.id && renderReplyForm(applicationId, true)}
                                        </div>
                                    );
                                })}

                                {/* Bottom Reply (General) */}
                                {!replyingToMessage && renderReplyForm(applicationId, false)}
                            </CardContent>
                        )}
                    </Card>
                );
            })}
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
