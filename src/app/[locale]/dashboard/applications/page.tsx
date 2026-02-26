import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import {
    GraduationCap,
    Building2,
    Clock,
    AlertCircle,
    CheckCircle2,
    FileText,
    CreditCard,
    ArrowRight
} from 'lucide-react';

export default async function StudentApplicationsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login?returnUrl=/dashboard/applications');
    }

    // Fetch all applications for this student
    const { data: applications, error } = await supabase
        .from('applications')
        .select(`
      *,
      university_program:university_program_id (
        id,
        tuition_fee,
        duration,
        program_catalog:program_catalog_id (
          title,
          level
        ),
        university:university_id (
          name,
          logo_url
        )
      )
    `)
        .eq('student_email', user.email)
        .order('created_at', { ascending: false });

    console.log('Found applications:', applications?.length, 'Error:', error);
    console.log('User email:', user.email);
    if (error) {
        console.error('Full error:', JSON.stringify(error, null, 2));
    }

    // Fetch pending payments count for each application
    const applicationIds = applications?.map(app => app.id) || [];
    const { data: pendingPayments } = await supabase
        .from('payment_transactions')
        .select('id, application_id')
        .in('application_id', applicationIds)
        .in('status', ['pending', 'pending_verification']);

    // Fetch pending documents count for each application
    const { data: pendingDocuments } = await supabase
        .from('document_requests')
        .select('id, application_id')
        .in('application_id', applicationIds)
        .in('status', ['pending']);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pending_documents': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'pending_payment': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'accepted': return <CheckCircle2 className="w-5 h-5 text-amber-600" />;
            case 'rejected': return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'under_review': return <Clock className="w-5 h-5 text-blue-600" />;
            case 'pending_documents': return <FileText className="w-5 h-5 text-orange-600" />;
            case 'pending_payment': return <CreditCard className="w-5 h-5 text-yellow-600" />;
            default: return <Clock className="w-5 h-5 text-gray-600" />;
        }
    };

    const formatStatus = (status: string) => {
        return status.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const getPendingPaymentsCount = (appId: string) => {
        return pendingPayments?.filter(p => p.application_id === appId).length || 0;
    };

    const getPendingDocumentsCount = (appId: string) => {
        return pendingDocuments?.filter(d => d.application_id === appId).length || 0;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
                    <p className="text-muted-foreground mt-1">
                        Track and manage your university applications
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {applications?.length || 0} Application{applications?.length !== 1 ? 's' : ''}
                    </Badge>
                </div>
            </div>

            {/* Applications List */}
            {applications && applications.length > 0 ? (
                <div className="grid gap-4">
                    {applications.map((application) => {
                        const pendingPaymentsCount = getPendingPaymentsCount(application.id);
                        const pendingDocsCount = getPendingDocumentsCount(application.id);
                        const hasActions = pendingPaymentsCount > 0 || pendingDocsCount > 0;

                        return (
                            <Card
                                key={application.id}
                                className={`hover:shadow-lg transition-shadow ${hasActions ? 'border-l-4 border-l-orange-500' : ''
                                    }`}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            {application.university_program?.university?.logo_url && (
                                                <Image
                                                    src={application.university_program.university.logo_url}
                                                    alt="University logo"
                                                    width={64}
                                                    height={64}
                                                    className="rounded-lg object-cover border"
                                                />
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <CardTitle className="text-xl">
                                                        {application.university_program?.program_catalog?.title}
                                                    </CardTitle>
                                                    <Badge className={`${getStatusColor(application.status)} border`}>
                                                        <span className="mr-1">{getStatusIcon(application.status)}</span>
                                                        {formatStatus(application.status)}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4" />
                                                        <span>{application.university_program?.university?.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="w-4 h-4" />
                                                        <span>{application.university_program?.program_catalog?.level}</span>
                                                        {application.university_program?.duration && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{application.university_program.duration}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                {/* Action Required Alerts */}
                                                {hasActions && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {pendingPaymentsCount > 0 && (
                                                            <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                                <CreditCard className="w-3 h-3 mr-1" />
                                                                {pendingPaymentsCount} Pending Payment{pendingPaymentsCount > 1 ? 's' : ''}
                                                            </Badge>
                                                        )}
                                                        {pendingDocsCount > 0 && (
                                                            <Badge className="bg-orange-100 text-orange-800 border border-orange-200">
                                                                <FileText className="w-3 h-3 mr-1" />
                                                                {pendingDocsCount} Missing Document{pendingDocsCount > 1 ? 's' : ''}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Link href={`/dashboard/applications/${application.id}`}>
                                            <Button className={hasActions ? 'bg-orange-600 hover:bg-orange-700' : ''}>
                                                {hasActions ? 'Take Action' : 'View Details'}
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center h-64 gap-4">
                        <GraduationCap className="w-16 h-16 text-muted-foreground" />
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Start your journey by applying to a university program
                            </p>
                            <Link href="/programs">
                                <Button>Browse Programs</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
