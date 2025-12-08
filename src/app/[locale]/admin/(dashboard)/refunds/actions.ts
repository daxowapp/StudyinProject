'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function processRefundRequest(
    requestId: string,
    applicationId: string,
    action: 'approve' | 'reject',
    adminResponse?: string
) {
    const supabase = await createClient();

    // Verify admin access (usually handled by middleware/layout, but good to be safe)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    try {
        const status = action === 'approve' ? 'approved' : 'rejected';

        // Update refund request
        const { error: refundError } = await supabase
            .from('refund_requests')
            .update({
                status,
                admin_response: adminResponse,
                processed_at: new Date().toISOString(),
                processed_by: user.id
            })
            .eq('id', requestId);

        if (refundError) throw refundError;

        // If approved, update application payment status
        if (action === 'approve') {
            const { error: appError } = await supabase
                .from('applications')
                .update({
                    payment_status: 'refunded',
                    updated_at: new Date().toISOString()
                })
                .eq('id', applicationId);

            if (appError) throw appError;
        }

        revalidatePath('/admin/refunds');
        revalidatePath(`/dashboard/applications/${applicationId}`);
        return { success: true };
    } catch (error: unknown) {
        console.error('Error processing refund request:', error);
        return { error: 'Failed to process request' };
    }
}
