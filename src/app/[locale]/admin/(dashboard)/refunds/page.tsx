import { createClient } from "@/lib/supabase/server";
import { RefundRequestsTable } from "./components/RefundRequestsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function AdminRefundsPage() {
    const t = await getTranslations();
    const supabase = await createClient();

    const { data: refundRequests, error } = await supabase
        .from("refund_requests")
        .select(`
      *,
      application:applications (
        id,
        student_name,
        student_email,
        payment_amount,
        payment_currency,
        university_program:university_program_id (
            university:university_id (
                name
            )
        )
      )
    `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching refund requests:", error);
        return <div>Error loading refund requests</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">{t('Refunds.title')}</h1>

            <Card>
                <CardHeader>
                    <CardTitle>{t('Refunds.title')} ({refundRequests?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <RefundRequestsTable initialData={refundRequests || []} />
                </CardContent>
            </Card>
        </div>
    );
}
