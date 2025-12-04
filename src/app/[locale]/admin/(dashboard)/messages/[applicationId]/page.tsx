'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ConversationThread } from '../components/ConversationThread';
import { toast } from 'sonner';

export default function ConversationPage({ params }: { params: Promise<{ applicationId: string }> }) {
    interface Message {
        id: string;
        sender_type: "student" | "admin";
        is_read: boolean;
        created_at: string;
        message: string;
        message_type: string;
        subject: string;
        requires_action: boolean;
        action_completed: boolean;
        message_attachments?: {
            id: string;
            file_url: string;
            file_name: string;
            file_size: number;
            file_type: string;
            mime_type: string;
        }[];
    }

    interface Application {
        id: string;
        student_name: string;
        student_email: string;
        university_program?: {
            program_catalog?: {
                title: string;
            } | {
                title: string;
            }[];
        } | {
            program_catalog?: {
                title: string;
            } | {
                title: string;
            }[];
        }[];
    }

    const { applicationId } = use(params);
    const [messages, setMessages] = useState<Message[]>([]);
    const [application, setApplication] = useState<Application | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    const fetchConversation = useCallback(async () => {
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
            setApplication(appData as unknown as Application);

            // Fetch messages
            const { data: msgData, error: msgError } = await supabase
                .from('application_messages')
                .select(`
          *,
          message_attachments (*)
        `)
                .eq('application_id', applicationId)
                .order('created_at', { ascending: true });

            if (msgError) throw msgError;
            setMessages((msgData || []) as unknown as Message[]);

            // Mark unread student messages as read
            const unreadIds = msgData
                ?.filter((m: Message) => m.sender_type === 'student' && !m.is_read)
                .map((m: Message) => m.id);

            if (unreadIds && unreadIds.length > 0) {
                await supabase
                    .from('application_messages')
                    .update({ is_read: true, read_at: new Date().toISOString() })
                    .in('id', unreadIds);
            }

        } catch (error) {
            console.error('Error fetching conversation:', error);
            toast.error('Failed to load conversation');
        } finally {
            setIsLoading(false);
        }
    }, [applicationId, supabase]);

    useEffect(() => {
        fetchConversation();
    }, [fetchConversation]);

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

    const getProgramTitle = (app: Application) => {
        const prog = Array.isArray(app.university_program)
            ? app.university_program[0]
            : app.university_program;

        if (!prog) return 'N/A';

        const catalog = Array.isArray(prog.program_catalog)
            ? prog.program_catalog[0]
            : prog.program_catalog;

        return catalog?.title || 'N/A';
    };

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
                        {getProgramTitle(application)}
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
