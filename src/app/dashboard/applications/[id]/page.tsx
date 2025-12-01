import { createClient, createAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Building2,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Mail,
  Calendar,
  User
} from 'lucide-react';
import { PaymentRequestCard } from '../components/PaymentRequestCard';
import { DocumentRequestCard } from '../components/DocumentRequestCard';

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const adminSupabase = await createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login?returnUrl=/dashboard/applications/' + id);
  }

  // Fetch application details
  const { data: application, error: appError } = await supabase
    .from('applications')
    .select(`
      *,
      university_program:university_program_id (
        id,
        tuition_fee,
        duration,
        program_catalog:program_catalog_id (
          title,
          level,
          description
        ),
        university:university_id (
          name,
          logo_url
        )
      )
    `)
    .eq('id', id)
    .single();

  if (!application) {
    console.error('Application not found:', id);
    console.error('Error details:', appError);
    redirect('/dashboard/applications');
  }

  // Fetch ALL payment transactions for this application (temporarily remove status filter)
  const { data: paymentTransactions, error: paymentError } = await adminSupabase
    .from('payment_transactions')
    .select('*')
    .eq('application_id', id)
    .order('created_at', { ascending: false });

  // Fetch ALL document requests (temporarily remove status filter)
  const { data: documentRequests, error: docError } = await adminSupabase
    .from('document_requests')
    .select('*')
    .eq('application_id', id)
    .order('created_at', { ascending: false });

  console.log('=== DEBUG INFO ===');
  console.log('Application ID:', id);
  console.log('Payment transactions:', paymentTransactions);
  console.log('Payment error:', paymentError);
  console.log('Document requests:', documentRequests);
  console.log('Document error:', docError);
  console.log('==================');

  // Fetch messages for this application
  const { data: messages } = await supabase
    .from('application_messages')
    .select('id, subject, created_at, is_read, sender_type')
    .eq('application_id', id)
    .order('created_at', { ascending: false })
    .limit(5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending_documents': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 className="w-5 h-5" />;
      case 'rejected': return <AlertCircle className="w-5 h-5" />;
      case 'under_review': return <Clock className="w-5 h-5" />;
      case 'pending_documents': return <FileText className="w-5 h-5" />;
      case 'pending_payment': return <CreditCard className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const unreadMessages = messages?.filter(m => !m.is_read && m.sender_type === 'admin').length || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/applications">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Applications
          </Button>
        </Link>
        <Link href="/dashboard/messages">
          <Button variant="outline" size="sm" className="gap-2">
            <Mail className="w-4 h-4" />
            Messages
            {unreadMessages > 0 && (
              <Badge className="ml-1 bg-blue-600 text-white">{unreadMessages}</Badge>
            )}
          </Button>
        </Link>
      </div>

      {/* Application Overview Card */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {application.university_program?.university?.logo_url && (
                <div className="w-20 h-20 rounded-xl bg-white p-2 shadow-md flex items-center justify-center">
                  <img
                    src={application.university_program.university.logo_url}
                    alt="University logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <CardTitle className="text-2xl">
                    {application.university_program?.program_catalog?.title}
                  </CardTitle>
                  <Badge className={`${getStatusColor(application.status)} border-2 gap-1 px-3 py-1`}>
                    {getStatusIcon(application.status)}
                    {formatStatus(application.status)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{application.university_program?.university?.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>{application.university_program?.program_catalog?.level}</span>
                    </div>
                    {application.university_program?.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{application.university_program.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{messages?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{documentRequests?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Document Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{paymentTransactions?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Payment Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments */}
      {paymentTransactions && paymentTransactions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-semibold">Pending Payments</h2>
          </div>
          {paymentTransactions.map((transaction) => (
            <PaymentRequestCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}

      {/* Missing Documents */}
      {documentRequests && documentRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold">Document Requests</h2>
          </div>
          <DocumentRequestCard requests={documentRequests} />
        </div>
      )}

      {/* Application Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Application Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Application ID</p>
              <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {application.id.slice(0, 8)}...
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className={`${getStatusColor(application.status)} border gap-1`}>
                {getStatusIcon(application.status)}
                {formatStatus(application.status)}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Student Name</p>
              <p className="text-sm">{application.student_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{application.student_email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Submitted</p>
              <p className="text-sm">{new Date(application.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm">{new Date(application.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>

          {application.admin_notes && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Admin Notes</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                    {application.admin_notes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Messages */}
      {messages && messages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Recent Messages
              </CardTitle>
              <Link href="/dashboard/messages">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-2 h-2 rounded-full ${!message.is_read && message.sender_type === 'admin' ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{message.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {!message.is_read && message.sender_type === 'admin' && (
                    <Badge className="bg-blue-600 text-white text-xs">New</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {(!paymentTransactions || paymentTransactions.length === 0) &&
        (!documentRequests || documentRequests.length === 0) && (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You have no pending actions for this application. We'll notify you if the admissions team requests any documents or payments.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
