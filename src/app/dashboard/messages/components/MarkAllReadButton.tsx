'use client';

import { Button } from '@/components/ui/button';
import { CheckCheck } from 'lucide-react';
import { markAllMessagesAsRead } from '../actions';
import { toast } from 'sonner';
import { useState } from 'react';

interface MarkAllReadButtonProps {
  applicationIds: string[];
  unreadCount: number;
}

export function MarkAllReadButton({ applicationIds, unreadCount }: MarkAllReadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleMarkAllRead() {
    setIsLoading(true);
    try {
      const result = await markAllMessagesAsRead(applicationIds);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('All messages marked as read');
      }
    } catch (error) {
      toast.error('Failed to mark messages as read');
    } finally {
      setIsLoading(false);
    }
  }

  if (unreadCount === 0) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleMarkAllRead}
      disabled={isLoading}
      className="gap-2"
    >
      <CheckCheck className="w-4 h-4" />
      Mark All as Read
    </Button>
  );
}
