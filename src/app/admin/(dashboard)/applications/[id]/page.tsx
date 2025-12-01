import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, ExternalLink, FileText, CreditCard, AlertCircle, CheckCircle2, Paperclip } from 'lucide-react';
import Link from 'next/link';
import { ApplicationManagementForm } from '../components/ApplicationManagementForm';
import { VerifyPaymentButton, ApproveDocumentButton, RejectPaymentButton, RejectDocumentButton } from '../components/AdminActionButtons';

export default async function ApplicationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch application with all details
    const { data: application, error } = await supabase
        .from('applications')
        .select(`
      *,
      university_program:university_program_id (
        id,
        tuition_fee,
        program_catalog:program_catalog_id (
          title,
          level,
          field
        ),
        university:university_id (
          name,
          logo_url,
          city
        )
      )
    `)
        .eq('id', id)
        .single();

    if (error || !application) {
        redirect('/admin/applications');
    }

    // Fetch Payment Transactions
    const { data: paymentTransactions } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('application_id', id)
        .order('created_at', { ascending: false });

    // Fetch Document Requests
    const { data: documentRequests } = await supabase
        .from('document_requests')
        .select('*')
        .eq('application_id', id)
        .order('created_at', { ascending: false });

    // Fetch Messages
    const { data: messages } = await supabase
        .from('application_messages')
        .select(`
            *,
            message_attachments (*)
        `)
        .eq('application_id', id)
        .order('created_at', { ascending: true });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/applications">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Applications
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Application Details
                    </h1>
                    <p className="text-muted-foreground">
                        Manage and review application
                    </p>
                </div>
                <Badge className={
                    application.status === 'accepted' ? 'bg-green-600' :
                        application.status === 'rejected' ? 'bg-red-600' :
                            application.status === 'under_review' ? 'bg-yellow-600' :
                                application.status === 'submitted' ? 'bg-blue-600' :
                                    application.status === 'pending_payment' ? 'bg-orange-600' :
                                        application.status === 'pending_documents' ? 'bg-purple-600' :
                                            application.status === 'payment_verification' ? 'bg-yellow-500' :
                                                application.status === 'document_verification' ? 'bg-purple-500' : 'bg-gray-600'
                }>
                    {application.status?.replace('_', ' ').toUpperCase()}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Application Info & Documents */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Application Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Full Name</Label>
                                <p className="font-medium">{application.student_name}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Email</Label>
                                <p className="font-medium">{application.student_email}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Phone</Label>
                                <p className="font-medium">{application.student_phone}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Passport Number</Label>
                                <p className="font-medium">{application.student_passport}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Nationality</Label>
                                <p className="font-medium">{application.student_country}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Program Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Program Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">University</Label>
                                <p className="font-medium">{application.university_program?.university?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Program</Label>
                                <p className="font-medium">{application.university_program?.program_catalog?.title}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Intake</Label>
                                <p className="font-medium">{application.preferred_intake}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Tuition Fee</Label>
                                <p className="font-medium">
                                    {application.university_program?.tuition_fee ? `$${application.university_program.tuition_fee}` : 'N/A'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div className="space-y-1">
                                    <p className="font-medium">Application Fee</p>
                                    <p className="text-sm text-muted-foreground">
                                        Status: <span className="font-medium text-foreground capitalize">{application.payment_status}</span>
                                    </p>
                                </div>
                                <Badge variant={application.payment_status === 'completed' ? 'default' : 'secondary'}>
                                    {application.payment_status?.toUpperCase()}
                                </Badge>
                            </div>

                            {/* Payment Transactions List */}
                            {paymentTransactions && paymentTransactions.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                        Payment History
                                    </h4>
                                    {paymentTransactions.map((tx) => (
                                        <div key={tx.id} className="border rounded-lg p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        {tx.amount} {tx.currency}
                                                    </span>
                                                </div>
                                                <Badge variant="outline">{tx.status}</Badge>
                                            </div>

                                            {/* Show Payment Method if Card */}
                                            {tx.payment_method === 'card' && (
                                                <div className="text-sm text-blue-600 font-medium flex items-center gap-1">
                                                    <CreditCard className="h-3 w-3" />
                                                    Paid via Card
                                                </div>
                                            )}

                                            {tx.receipt_url && (
                                                <div className="flex items-center gap-2 pt-2 border-t">
                                                    <Link href={tx.receipt_url} target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                                        <FileText className="h-3 w-3" />
                                                        View Receipt
                                                    </Link>
                                                </div>
                                            )}

                                            {/* Verification Actions */}
                                            {tx.status === 'pending_verification' && (
                                                <div className="flex items-center gap-2 pt-2">
                                                    <VerifyPaymentButton
                                                        transactionId={tx.id}
                                                    />
                                                    <RejectPaymentButton
                                                        transactionId={tx.id}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {documentRequests && documentRequests.length > 0 ? (
                                <div className="space-y-4">
                                    {documentRequests.map((doc) => (
                                        <div key={doc.id} className="border rounded-lg p-4 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="font-medium">{doc.title}</p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Badge variant={
                                                        doc.status === 'approved' ? 'default' :
                                                            doc.status === 'rejected' ? 'destructive' :
                                                                doc.status === 'submitted' ? 'secondary' : 'outline'
                                                    }>
                                                        {doc.status}
                                                    </Badge>
                                                    <span>Requested on: {new Date(doc.created_at).toLocaleDateString()}</span>
                                                </div>
                                                {doc.rejection_reason && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        Reason: {doc.rejection_reason}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {doc.file_url && (
                                                    <Link href={doc.file_url} target="_blank">
                                                        <Button variant="ghost" size="sm">
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Download
                                                        </Button>
                                                    </Link>
                                                )}

                                                {/* Verification Actions */}
                                                {doc.status === 'submitted' && (
                                                    <div className="flex items-center gap-2">
                                                        <ApproveDocumentButton
                                                            requestId={doc.id}
                                                        />
                                                        <RejectDocumentButton
                                                            requestId={doc.id}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-4">
                                    No documents requested yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Messages Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Messages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {messages && messages.length > 0 ? (
                                <div className="space-y-4 max-h-[400px] overflow-y-auto p-4 border rounded-md">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col ${msg.sender_type === 'admin' ? 'items-end' : 'items-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-3 ${msg.sender_type === 'admin'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                    }`}
                                            >
                                                <p className="text-sm">{msg.message}</p>
                                                {msg.message_attachments && msg.message_attachments.length > 0 && (
                                                    <div className="mt-2 space-y-1">
                                                        {msg.message_attachments.map((att: any) => (
                                                            <Link
                                                                key={att.id}
                                                                href={att.file_url}
                                                                target="_blank"
                                                                className="flex items-center gap-1 text-xs underline"
                                                            >
                                                                <Paperclip className="h-3 w-3" />
                                                                {att.file_name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {msg.sender_type === 'admin' ? 'You' : 'Student'} • {new Date(msg.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No messages yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-6">
                    <ApplicationManagementForm
                        application={application}
                    />
                </div>
            </div>
        </div>
    );
}
