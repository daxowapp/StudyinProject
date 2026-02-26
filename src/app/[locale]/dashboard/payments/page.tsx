
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Download,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { Price } from '@/components/currency/PriceDisplay';

export default async function PaymentsPage() {
  const t = await getTranslations('PaymentDashboard');
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?returnUrl=/dashboard/payments');
  }

  // Fetch all payment transactions
  const { data: payments } = await supabase
    .from('payment_transactions')
    .select(`
  *,
  application: application_id(
    id,
    university_program: university_program_id(
      program_catalog: program_catalog_id(
        title
      ),
      university: university_id(
        name
      )
    )
  )
    `)
    .eq('student_id', user.id)
    .order('created_at', { ascending: false });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t('paymentStatuses.completed')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            {t('paymentStatuses.pending')}
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            {t('paymentStatuses.processing')}
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            {t('paymentStatuses.failed')}
          </Badge>
        );
      case 'refunded':
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t('paymentStatuses.refunded')}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      application_fee: t('types.application_fee'),
      service_fee: t('types.service_fee'),
      tuition_deposit: t('types.tuition_deposit'),
      full_tuition: t('types.full_tuition'),
      accommodation: t('types.accommodation'),
      other: t('types.other'),
    };
    return labels[type] || type;
  };

  const totalPaid = payments
    ?.filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

  const totalPending = payments
    ?.filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

  const pendingCount = payments?.filter((p) => p.status === 'pending').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Payment Request Card */}
      <Card className="border-l-4 border-l-primary shadow-md bg-card">
        <CardHeader>
          <CardTitle>{t('paymentRequest.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold">{t('paymentRequest.amount')}</h3>
              <p className="text-muted-foreground">{t('paymentRequest.description')}</p>
            </div>
            <Button>{t('payNow')}</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('paymentRequest.note')}
          </p>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-500/10 to-indigo-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalAmount')}</CardTitle>
            <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Price amount={totalPaid + totalPending} currency="CNY" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t('allTime')}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalPaid')}</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Price amount={totalPaid} currency="CNY" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t('successfullyProcessed')}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('rest')}</CardTitle>
            <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Price amount={totalPending} currency="CNY" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{pendingCount} {t('paymentDue')}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalTransactions')}</CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('allTime')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      {payments && payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
            <Card key={payment.id} className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left: Payment Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {getPaymentTypeLabel(payment.payment_type)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {payment.application?.university_program?.program_catalog?.title}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('amount')}</p>
                        <p className="font-semibold text-lg">
                          <Price amount={parseFloat(payment.amount)} currency={payment.currency || 'CNY'} />
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('status')}</p>
                        <div className="mt-1">{getStatusBadge(payment.status)}</div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('created')}</p>
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(payment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {payment.paid_at && (
                        <div>
                          <p className="text-muted-foreground">{t('paidOn')}</p>
                          <p className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            {new Date(payment.paid_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {payment.metadata && (payment.metadata as Record<string, unknown>)?.document_name && payment.payment_reference && (
                        <div>
                          <p className="text-muted-foreground">{t('reference')}</p>
                          <p className="font-mono text-xs">{payment.payment_reference}</p>
                        </div>
                      )}
                      {payment.payment_method && (
                        <div>
                          <p className="text-muted-foreground">{t('method')}</p>
                          <p className="capitalize">{payment.payment_method.replace('_', ' ')}</p>
                        </div>
                      )}
                    </div>

                    {payment.admin_verified && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('verifiedByAdmin')}</span>
                        {payment.verified_at && (
                          <span className="text-muted-foreground">
                            {t('expires')} {new Date((payment.metadata as Record<string, string>).payment_link_expires_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}

                    {payment.verification_notes && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                        <p className="font-semibold text-blue-900">{t('adminNote')}</p>
                        <p className="text-blue-800">{payment.verification_notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2 lg:items-end">
                    {payment.status === 'pending' && payment.payment_link && (
                      <>
                        {payment.payment_link_expires_at &&
                          new Date(payment.payment_link_expires_at) > new Date() ? (
                          <Link href={payment.payment_link}>
                            <Button className="w-full lg:w-auto bg-amber-600 hover:bg-amber-700">
                              <CreditCard className="w-4 h-4 mr-2" />
                              {t('payNow')}
                            </Button>
                          </Link>
                        ) : (
                          <Button disabled className="w-full lg:w-auto">
                            {t('paymentLinkExpired')}
                          </Button>
                        )}
                        {(payment.metadata as Record<string, unknown>)?.document_name && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {t('document')} {(payment.metadata as Record<string, string>).document_name}
                          </div>
                        )}
                      </>
                    )}

                    {payment.payment_proof_url && (
                      <a
                        href={payment.payment_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="w-full lg:w-auto gap-2">
                          <Download className="w-4 h-4" />
                          {t('paymentProof')}
                        </Button>
                      </a>
                    )}

                    <Link href={`/dashboard/applications/${payment.application_id}`}>
                      <Button variant="outline" size="sm" className="w-full lg:w-auto gap-2">
                        <ExternalLink className="w-4 h-4" />
                        {t('viewApplication')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('noPayments')}</h3>
            <p className="text-gray-600">
              {t('noPaymentsDesc')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Help Card */}
      {pendingCount > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertCircle className="w-5 h-5" />
              {t('assistance.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-900">
            <p className="mb-4">
              {t('assistance.description', { count: pendingCount })}
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>{t('assistance.point1')}</li>
              <li>{t('assistance.point2')}</li>
              <li>{t('assistance.point3')}</li>
            </ul>
            <Link href="/contact">
              <Button variant="outline" className="border-yellow-600 text-yellow-900 hover:bg-yellow-100">
                {t('contactSupport')}
              </Button>
            </Link>
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
