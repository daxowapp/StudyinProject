'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ConversationThread } from '../components/ConversationThread';

export default function ConversationPage({ params }: { params: Promise<{ applicationId: string }> }) {
    const { applicationId } = use(params);
    const [messages, setMessages] = useState<any[]>([]);
    const [application, setApplication] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchConversation();
    }, [applicationId]);

    const fetchConversation = async () => {
        setIsLoading(true);
        try {
            // Fetch application details
            const { data: appData, error: appError } = await supabase
                .from('applications')
                .select(`
          id,
          student_name,
          student_email,
          university_program:university_programs (
            program_catalog:program_catalog (
              title
            )
          )
        `)
                .eq('id', applicationId)
                .single();

            if (appError) throw appError;
            setApplication(appData);

            // Fetch messages
            const { data: msgData, error: msgError } = await supabase
                .from('application_messages')
                .select(`
          *,
          message_attachments (
            id,
            file_name,
            file_url,
            file_size,
            file_type,
            mime_type
          )
        `)
                .eq('application_id', applicationId)
                .order('created_at', { ascending: true });

            if (msgError) throw msgError;
            setMessages(msgData || []);

            // Mark unread student messages as read
            const unreadIds = msgData
                ?.filter((m: any) => m.sender_type === 'student' && !m.is_read)
                .map((m: any) => m.id);

            if (unreadIds && unreadIds.length > 0) {
                await supabase
                    .from('application_messages')
                    .update({ is_read: true })
                    .in('id', unreadIds);
            }

        } catch (error) {
            console.error('Error fetching conversation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!application) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-red-600">Application not found</h2>
                <Link href="/admin/messages">
                    <Button variant="outline" className="mt-4">Back to Messages</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/messages">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Conversation with {application.student_name}
                    </h1>
                    <p className="text-muted-foreground">
                        {application.university_program?.program_catalog?.title}
                    </p>
                </div>
                <Link href={`/admin/applications/${applicationId}`} className="ml-auto">
                    <Button variant="outline">View Application Details</Button>
                </Link>
            </div>

            <ConversationThread
                messages={messages}
                applicationId={applicationId}
                studentName={application.student_name}
            />
        </div>
    );
}
