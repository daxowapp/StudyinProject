import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Mail,
  MailOpen,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default async function MessagesPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?returnUrl=/dashboard/messages');
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
      )
    `)
    .in('application_id', applicationIds)
    .order('created_at', { ascending: false });

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'document_request':
        return <FileText className="w-5 h-5" />;
      case 'payment_request':
        return <CreditCard className="w-5 h-5" />;
      case 'status_update':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'acceptance_letter':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'document_request':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'payment_request':
        return 'border-l-blue-500 bg-blue-50';
      case 'acceptance_letter':
        return 'border-l-green-500 bg-green-50';
      case 'rejection_notice':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const unreadCount = messages?.filter((m) => !m.is_read).length || 0;
  const actionRequiredCount = messages?.filter((m) => m.requires_action && !m.action_completed).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Communication with admissions team
          </p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="gap-2">
            <Mail className="w-4 h-4" />
            {unreadCount} Unread
          </Badge>
          {actionRequiredCount > 0 && (
            <Badge className="bg-yellow-100 text-yellow-800 gap-2">
              <AlertCircle className="w-4 h-4" />
              {actionRequiredCount} Action Required
            </Badge>
          )}
        </div>
      </div>

      {/* Messages List */}
      {messages && messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message: any) => (
            <Card
              key={message.id}
              className={`border-l-4 ${getMessageColor(message.message_type)} ${
                !message.is_read ? 'shadow-lg' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getMessageIcon(message.message_type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{message.subject}</CardTitle>
                        {!message.is_read && (
                          <Badge className="bg-blue-600 text-white">New</Badge>
                        )}
                        {message.requires_action && !message.action_completed && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <span>
                          {message.application?.university_program?.program_catalog?.title}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>

                {message.requires_action && !message.action_completed && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-yellow-900">Action Required</p>
                        <p className="text-sm text-yellow-800">
                          {message.action_type === 'upload_document' && 'Please upload the requested document'}
                          {message.action_type === 'make_payment' && 'Please complete the payment'}
                          {message.action_type === 'respond' && 'Please respond to this message'}
                        </p>
                        {message.action_deadline && (
                          <p className="text-sm text-yellow-800 mt-1 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Deadline: {new Date(message.action_deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {message.attachments && message.attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Attachments:</p>
                    {message.attachments.map((attachment: any, index: number) => (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <FileText className="w-4 h-4" />
                        {attachment.name}
                      </a>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Link href={`/dashboard/applications/${message.application_id}`}>
                    <Button variant="outline" size="sm">
                      View Application
                    </Button>
                  </Link>
                  {message.requires_action && !message.action_completed && (
                    <Link href={`/dashboard/applications/${message.application_id}`}>
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                        Take Action
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <MailOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Messages</h3>
            <p className="text-gray-600">
              You don't have any messages yet. Messages from the admissions team will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
