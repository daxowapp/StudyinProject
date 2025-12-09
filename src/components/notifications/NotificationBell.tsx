'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
    FileText,
    Upload,
    CreditCard,
    MessageSquare,
    UserPlus,
    Users,
    FileCheck,
    Award,
} from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    link?: string;
    created_at: string;
}

const iconMap: Record<string, React.ElementType> = {
    status_change: FileText,
    application_status: FileText,
    document_requested: Upload,
    payment_requested: CreditCard,
    message_received: MessageSquare,
    new_application: UserPlus,
    new_lead: Users,
    document_uploaded: FileCheck,
    acceptance_letter: Award,
    default: Bell,
};

interface NotificationBellProps {
    userId: string;
    className?: string;
}

export function NotificationBell({ userId, className }: NotificationBellProps) {
    const t = useTranslations('Notifications');
    const tStatus = useTranslations('Status');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const supabase = createClient();

    const fetchNotifications = useCallback(async () => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (!error && data) {
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.read).length);
        }
        setLoading(false);
    }, [supabase, userId]);

    useEffect(() => {
        fetchNotifications();

        // Subscribe to realtime notifications
        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                () => {
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, userId, fetchNotifications]);

    const markAsRead = async (id: string) => {
        await supabase.from('notifications').update({ read: true }).eq('id', id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read) {
            await markAsRead(notification.id);
        }
        setOpen(false);
    };

    const getIcon = (type: string) => {
        const Icon = iconMap[type] || iconMap.default;
        return Icon;
    };

    const getTranslatedContent = (notification: Notification) => {
        let title = notification.title;
        let message = notification.message;

        // Translate Title
        if (title === 'Application Status Updated') {
            title = t('types.statusChange');
        }

        // Translate Message
        const statusPrefix = 'Your application status has changed to ';
        if (message && message.startsWith(statusPrefix)) {
            const status = message.replace(statusPrefix, '').trim();
            // Try to translate status, fallback to original if not found (though existing logic implies keys match)
            // The status in DB is likely the key (e.g. pending_payment), but sometimes might be raw text.
            // Assuming it matches keys in Status namespace.
            const translatedStatus = tStatus(status as any); // Type assertion as keys are dynamic

            // If the key doesn't exist, tStatus usually returns the key.
            // Check if returned value is same as key (and key contains no spaces).
            // But 'Status' namespace has keys like 'pending_payment'.

            message = t('messages.statusChange', { status: translatedStatus });
        }

        return { title, message };
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn('relative', className)}
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs font-bold"
                            variant="destructive"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>{t('title')}</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                                e.preventDefault();
                                markAllAsRead();
                            }}
                        >
                            <CheckCheck className="h-3 w-3 me-1" />
                            {t('markAllRead')}
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <Bell className="h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">{t('noNotifications')}</p>
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            const Icon = getIcon(notification.type);
                            const { title, message } = getTranslatedContent(notification);

                            const content = (
                                <div
                                    className={cn(
                                        'flex gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors',
                                        !notification.read && 'bg-primary/5'
                                    )}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div
                                        className={cn(
                                            'h-9 w-9 rounded-full flex items-center justify-center shrink-0',
                                            !notification.read
                                                ? 'bg-primary/10 text-primary'
                                                : 'bg-muted text-muted-foreground'
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p
                                                className={cn(
                                                    'text-sm truncate',
                                                    !notification.read && 'font-semibold'
                                                )}
                                            >
                                                {title}
                                            </p>
                                            {!notification.read && (
                                                <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {message}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDistanceToNow(new Date(notification.created_at), {
                                                addSuffix: true,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );

                            return notification.link ? (
                                <Link
                                    key={notification.id}
                                    href={notification.link}
                                    className="block"
                                >
                                    {content}
                                </Link>
                            ) : (
                                <div key={notification.id}>{content}</div>
                            );
                        })
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="justify-center">
                    <Link href="/dashboard/notifications" className="w-full text-center text-sm">
                        {t('viewAll')}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
