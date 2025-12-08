import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, AlertCircle, MessageSquare } from 'lucide-react';
import { StudentMessageThreads } from './components/StudentMessageThreads';

interface Attachment {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  mime_type: string;
  file_size: number;
}

interface Message {
  id: string;
  application_id: string;
  sender_type: string;
  is_read: boolean;
  requires_action: boolean;
  action_completed: boolean;
  created_at: string;
  message: string;
  subject?: string;
  message_attachments?: Attachment[];
  application?: {
    id: string;
    university_program?: {
      program_catalog?: {
        title: string;
      };
    };
  };
}

export default async function MessagesPage() {
  const t = await getTranslations('Messages');
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?returnUrl=/dashboard/messages');
  }

  // Fetch all applications for this student
  const { data: applications } = await supabase
    .from('applications')
    .select('id, university_program:university_program_id(program_catalog:program_catalog_id(title))')
    .eq('student_id', user.id);

  const applicationIds = applications?.map((app) => app.id) || [];

  // Fetch all messages for student's applications
  const { data: messages } = await supabase
    .from('application_messages')
    .select(`
      *,
      application:application_id (
        id,
        university_program:university_program_id (
          program_catalog:program_catalog_id (
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
      ),
      parent_message_id
    `)
    .in('application_id', applicationIds)
    .order('created_at', { ascending: false })
    .returns<Message[]>();

  const unreadCount = messages?.filter((m) => !m.is_read && m.sender_type === 'admin').length || 0;
  const actionRequiredCount = messages?.filter((m) => m.requires_action && !m.action_completed).length || 0;


  // Group messages by application
  const threadMap = new Map<string, Message[]>();
  messages?.forEach(msg => {
    const key = msg.application_id;
    if (!threadMap.has(key)) {
      threadMap.set(key, []);
    }
    threadMap.get(key)!.push(msg);
  });

  const threads = Array.from(threadMap.entries()).map(([applicationId, msgs]) => {
    msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const latestMessage = msgs[msgs.length - 1];
    const unread = msgs.filter(m => !m.is_read && m.sender_type === 'admin').length;
    const hasAction = msgs.some(m => m.requires_action && !m.action_completed);

    return {
      applicationId,
      programTitle: msgs[0].application?.university_program?.program_catalog?.title || 'N/A',
      messages: msgs,
      latestMessage,
      unreadCount: unread,
      hasActionRequired: hasAction
    };
  });

  threads.sort((a, b) =>
    new Date(b.latestMessage.created_at).getTime() - new Date(a.latestMessage.created_at).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('conversations')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threads.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('unreadMessages')}</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('actionRequired')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{actionRequiredCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Message Threads */}
      {threads.length > 0 ? (
        <StudentMessageThreads threads={threads} />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 gap-4">
            <MessageSquare className="w-16 h-16 text-muted-foreground" />
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{t('noMessages')}</h3>
              <p className="text-muted-foreground">
                {t('noMessagesDesc')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
