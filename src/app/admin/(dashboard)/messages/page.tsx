'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Search,
    Loader2,
    MessageSquare,
    AlertCircle,
    Clock,
    RefreshCw,
    User,
    Shield,
    Send,
    ChevronDown,
    ChevronRight,
    Paperclip,
    Download,
    FileText,
    Image as ImageIcon,
    File
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sendAdminReply } from './actions';
import { toast } from 'sonner';

interface MessageThread {
    applicationId: string;
    studentName: string;
    studentEmail: string;
    programTitle: string;
    messages: any[];
    latestMessage: any;
    unreadCount: number;
    hasActionRequired: boolean;
}

export default function MessagesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState<any[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(() => fetchMessages(true), 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchMessages = async (silent = false) => {
        if (!silent) setIsLoading(true);
        setIsRefreshing(true);

        try {
            const { data, error } = await supabase
                .from('application_messages')
                .select(`
          *,
          application:applications (
            id,
            student_name,
            student_email,
            status,
            university_program:university_programs (
              program_catalog:program_catalog (
                title
              )
            )
          ),
          message_attachments (
            id,
            file_name,
            file_url,
            file_size,
            file_type,
            mime_type
          )
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const groupMessagesByThread = (): MessageThread[] => {
        const threadMap = new Map<string, any[]>();

        messages.forEach(msg => {
            const key = msg.application_id;
            if (!threadMap.has(key)) {
                threadMap.set(key, []);
            }
            threadMap.get(key)!.push(msg);
        });

        const threads: MessageThread[] = [];
        threadMap.forEach((msgs, applicationId) => {
            msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

            const latestMessage = msgs[msgs.length - 1];
            const unreadCount = msgs.filter(m => !m.is_read && m.sender_type === 'student').length;
            const hasActionRequired = msgs.some(m => m.requires_action && !m.action_completed);

            threads.push({
                applicationId,
                studentName: msgs[0].application?.student_name || 'Unknown',
                studentEmail: msgs[0].application?.student_email || '',
                programTitle: msgs[0].application?.university_program?.program_catalog?.title || 'N/A',
                messages: msgs,
                latestMessage,
                unreadCount,
                hasActionRequired
            });
        });

        threads.sort((a, b) =>
            new Date(b.latestMessage.created_at).getTime() - new Date(a.latestMessage.created_at).getTime()
        );

        return threads;
    };

    const filteredThreads = groupMessagesByThread().filter(thread => {
        const searchLower = searchQuery.toLowerCase();
        return (
            thread.studentName.toLowerCase().includes(searchLower) ||
            thread.programTitle.toLowerCase().includes(searchLower) ||
            thread.messages.some(m =>
                m.subject?.toLowerCase().includes(searchLower) ||
                m.message?.toLowerCase().includes(searchLower)
            )
        );
    });

    const toggleThread = (applicationId: string) => {
        const newExpanded = new Set(expandedThreads);
        if (newExpanded.has(applicationId)) {
            newExpanded.delete(applicationId);
        } else {
            newExpanded.add(applicationId);
        }
        setExpandedThreads(newExpanded);
    };

    const handleSendReply = async (applicationId: string, studentName: string) => {
        if (!replyText.trim()) {
            toast.error('Please enter a message');
            return;
        }

        setIsSending(true);
        try {
            const result = await sendAdminReply(
                applicationId,
                `Re: Conversation with ${studentName}`,
                replyText,
                'general',
                false
            );

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Reply sent successfully!');
                setReplyText('');
                setReplyingTo(null);
                await fetchMessages(true);
            }
        } catch (error) {
            toast.error('Failed to send reply');
        } finally {
            setIsSending(false);
        }
    };

    const getFileIcon = (fileType: string, mimeType: string) => {
        if (mimeType?.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-blue-600" />;
        if (mimeType === 'application/pdf') return <FileText className="w-4 h-4 text-red-600" />;
        return <File className="w-4 h-4 text-gray-600" />;
    };

    const stats = {
        total: messages.length,
        unread: messages.filter(m => !m.is_read && m.sender_type === 'student').length,
        actionRequired: messages.filter(m => m.requires_action && !m.action_completed).length,
        threads: filteredThreads.length
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                    <p className="text-muted-foreground mt-1">
                        Threaded conversations with students
                    </p>
                </div>
                <Button
                    onClick={() => fetchMessages()}
                    disabled={isRefreshing}
                    variant="outline"
                    className="gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.threads}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unread</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.unread}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Action Required</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.actionRequired}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search conversations by student name, program, or message content..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Message Threads */}
            <div className="space-y-4">
                {filteredThreads.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center h-64 gap-4">
                            <MessageSquare className="w-16 h-16 text-muted-foreground" />
                            <div className="text-center">
                                <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
                                <p className="text-muted-foreground">
                                    {searchQuery ? 'Try a different search term' : 'Messages will appear here when students contact you'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    filteredThreads.map((thread) => {
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
                                                    <h3 className="font-semibold text-lg">{thread.studentName}</h3>
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

                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {thread.programTitle}
                                                </p>

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
                                        {thread.messages.map((message, index) => {
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
                                                                    {isAdmin ? 'Admin' : thread.studentName}
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

                                                        {/* Attachments */}
                                                        {message.message_attachments && message.message_attachments.length > 0 && (
                                                            <div className="mt-3 pt-3 border-t">
                                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                                    <Paperclip className="w-4 h-4" />
                                                                    {message.message_attachments.length} attachment{message.message_attachments.length > 1 ? 's' : ''}
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {message.message_attachments.map((attachment: any) => (
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
                                                            onClick={() => handleSendReply(thread.applicationId, thread.studentName)}
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
                                                    Reply to {thread.studentName}
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
