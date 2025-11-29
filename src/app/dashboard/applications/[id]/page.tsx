import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import {
  Building2,
  GraduationCap,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Mail,
  Phone,
  MapPin,
  User,
  CreditCard,
  MessageSquare,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?returnUrl=/dashboard/applications/' + id);
  }

  // Fetch application with all details
  const { data: application, error } = await supabase
    .from('applications')
    .select(`
      *,
      university_program:university_program_id (
        id,
        slug,
        tuition_fee,
        currency,
        duration,
        intake,
        scholarship_chance,
        application_fee,
        service_fee,
        program_catalog:program_catalog_id (
          id,
          title,
          level,
          category,
          field,
          description
        ),
        university:university_id (
          id,
          name,
          slug,
          city,
          province,
          logo_url,
          website
        ),
        language:language_id (
          name,
          code
        )
      )
    `)
    .eq('id', id)
    .eq('student_id', user.id)
    .single();

  if (error || !application) {
    notFound();
  }

  // Fetch application documents
  const { data: documents } = await supabase
    .from('application_documents')
    .select('*')
    .eq('application_id', id)
    .order('created_at', { ascending: false });

  // Fetch status history
  const { data: statusHistory } = await supabase
    .from('application_status_history')
    .select('*')
    .eq('application_id', id)
    .order('created_at', { ascending: false });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'pending_documents':
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'submitted':
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            {application.university_program?.university?.logo_url && (
              <img
                src={application.university_program.university.logo_url}
                alt={application.university_program.university.name}
                className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {application.university_program?.program_catalog?.title}
              </h1>
              <p className="text-lg text-gray-600">
                {application.university_program?.university?.name}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(application.status)}>
              {formatStatus(application.status)}
            </Badge>
            <Badge variant="outline">
              <GraduationCap className="w-3 h-3 mr-1" />
              {application.university_program?.program_catalog?.level}
            </Badge>
            <Badge variant="outline">
              <Calendar className="w-3 h-3 mr-1" />
              Applied {new Date(application.created_at).toLocaleDateString()}
            </Badge>
          </div>
        </div>

        <Card className="lg:w-80">
          <CardHeader>
            <CardTitle className="text-sm">Application ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm">{application.id}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Reference this ID when contacting support
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Program Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Program Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">University</p>
                  <p className="font-semibold">
                    {application.university_program?.university?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">
                    {application.university_program?.university?.city},{' '}
                    {application.university_program?.university?.province}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Program Level</p>
                  <p className="font-semibold">
                    {application.university_program?.program_catalog?.level}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">
                    {application.university_program?.duration}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="font-semibold">
                    {application.university_program?.language?.name || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Intake</p>
                  <p className="font-semibold">
                    {application.preferred_intake || application.university_program?.intake}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tuition Fee</p>
                  <p className="text-lg font-bold text-primary">
                    {application.university_program?.tuition_fee}{' '}
                    {application.university_program?.currency}/year
                  </p>
                </div>
                {application.university_program?.scholarship_chance && (
                  <div>
                    <p className="text-sm text-muted-foreground">Scholarship</p>
                    <p className="font-semibold text-green-600">
                      {application.university_program.scholarship_chance}
                    </p>
                  </div>
                )}
              </div>

              <Link
                href={`/programs/${application.university_program?.slug}`}
                target="_blank"
              >
                <Button variant="outline" className="w-full gap-2">
                  View Program Details
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-semibold">{application.student_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {application.student_email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {application.student_phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {application.student_country}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Passport Number</p>
                  <p className="font-semibold">{application.student_passport}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold mb-2">Emergency Contact</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{application.emergency_contact_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">{application.emergency_contact_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Relationship</p>
                    <p className="font-semibold">
                      {application.emergency_contact_relationship}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Uploaded Documents
              </CardTitle>
              <CardDescription>
                {documents?.length || 0} document(s) uploaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents && documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{doc.document_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(doc.file_size / 1024).toFixed(2)} KB •{' '}
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.is_verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No documents uploaded yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Notes */}
          {application.admin_notes && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <MessageSquare className="w-5 h-5" />
                  Message from Admin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-900">{application.admin_notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Rejection Reason */}
          {application.status === 'rejected' && application.rejection_reason && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <AlertCircle className="w-5 h-5" />
                  Rejection Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-900">{application.rejection_reason}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Application Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusHistory && statusHistory.length > 0 ? (
                  statusHistory.map((history: any, index: number) => (
                    <div key={history.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-primary' : 'bg-muted'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              index === 0 ? 'text-white' : 'text-muted-foreground'
                            }`}
                          />
                        </div>
                        {index < statusHistory.length - 1 && (
                          <div className="w-0.5 h-full bg-muted flex-1 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-semibold">{formatStatus(history.new_status)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(history.created_at).toLocaleString()}
                        </p>
                        {history.notes && (
                          <p className="text-sm mt-1 text-muted-foreground">
                            {history.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Application Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(application.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          {application.payment_amount && application.payment_amount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">
                    {application.payment_amount} {application.payment_currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={
                      application.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {application.payment_status || 'Pending'}
                  </Badge>
                </div>
                {application.payment_reference && (
                  <div>
                    <p className="text-sm text-muted-foreground">Reference</p>
                    <p className="font-mono text-sm">{application.payment_reference}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/programs/${application.university_program?.slug}`}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Program Page
                </Button>
              </Link>
              <Link
                href={`/universities/${application.university_program?.university?.slug}`}
              >
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Building2 className="w-4 h-4" />
                  View University
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
