'use server';

import { createClient } from '@/lib/supabase/server';

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    link?: string;
    created_at: string;
}

export interface CreateNotificationParams {
    userId: string;
    title: string;
    message: string;
    type: string;
    link?: string;
}

/**
 * Create a new notification
 */
export async function createNotification(params: CreateNotificationParams) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('notifications')
        .insert({
            user_id: params.userId,
            title: params.title,
            message: params.message,
            type: params.type,
            link: params.link,
            read: false,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating notification:', error);
        return null;
    }

    return data;
}

/**
 * Get notifications for a user
 */
export async function getNotifications(userId: string, limit = 20, offset = 0) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }

    return data as Notification[];
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
    const supabase = await createClient();

    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

    if (error) {
        console.error('Error getting unread count:', error);
        return 0;
    }

    return count || 0;
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

    if (error) {
        console.error('Error marking notification as read:', error);
        return false;
    }

    return true;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

    if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
    }

    return true;
}

/**
 * Notification type icons mapping
 */
export const notificationIcons: Record<string, string> = {
    status_change: 'FileText',
    application_status: 'FileText',
    document_requested: 'Upload',
    payment_requested: 'CreditCard',
    message_received: 'MessageSquare',
    new_application: 'UserPlus',
    new_lead: 'Users',
    document_uploaded: 'FileCheck',
    acceptance_letter: 'Award',
    default: 'Bell',
};
