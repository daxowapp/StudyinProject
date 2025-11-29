'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function markMessageAsRead(messageId: string) {
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('application_messages')
        .update({ 
            is_read: true,
            read_at: new Date().toISOString()
        })
        .eq('id', messageId);
    
    if (error) return { error: error.message };
    
    revalidatePath('/dashboard/messages');
    revalidatePath('/dashboard');
    return { success: true };
}

export async function markAllMessagesAsRead(applicationIds: string[]) {
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('application_messages')
        .update({ 
            is_read: true,
            read_at: new Date().toISOString()
        })
        .in('application_id', applicationIds)
        .eq('is_read', false);
    
    if (error) return { error: error.message };
    
    revalidatePath('/dashboard/messages');
    revalidatePath('/dashboard');
    return { success: true };
}
