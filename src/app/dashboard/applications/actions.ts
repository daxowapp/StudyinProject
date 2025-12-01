'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadPaymentReceipt(
    transactionId: string,
    formData: FormData
) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const file = formData.get('file') as File;
    if (!file) return { error: 'No file provided' };

    try {
        // Upload file to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${transactionId}/receipt_${Date.now()}.${fileExt}`;
        const filePath = `payment-receipts/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

        // Update payment transaction
        const { data: transaction, error: updateError } = await supabase
            .from('payment_transactions')
            .update({
                receipt_url: publicUrl,
                payment_method: 'receipt',
                status: 'pending_verification',
                updated_at: new Date().toISOString()
            })
            .eq('id', transactionId)
            .select('application_id')
            .single();

        if (updateError) throw updateError;

        // Update application status
        if (transaction?.application_id) {
            await supabase
                .from('applications')
                .update({
                    status: 'payment_verification',
                    updated_at: new Date().toISOString()
                })
                .eq('id', transaction.application_id);
        }

        revalidatePath('/dashboard/applications');
        revalidatePath('/admin/applications'); // Update admin list
        revalidatePath('/admin/applications/[id]'); // Update admin detail page
        return { success: true, receiptUrl: publicUrl };
    } catch (error: any) {
        console.error('Error uploading receipt:', error);
        return { error: error.message };
    }
}

export async function uploadDocument(
    requestId: string,
    formData: FormData
) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const file = formData.get('file') as File;
    if (!file) return { error: 'No file provided' };

    try {
        // Get document request details
        const { data: docRequest, error: fetchError } = await supabase
            .from('document_requests')
            .select('document_name, application_id')
            .eq('id', requestId)
            .single();

        if (fetchError) throw fetchError;

        // Upload file to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${docRequest.application_id}/${docRequest.document_name.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;
        const filePath = `student-documents/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

        // Update document request
        const { error: updateError } = await supabase
            .from('document_requests')
            .update({
                uploaded_file_url: publicUrl,
                status: 'submitted',
                uploaded_at: new Date().toISOString()
            })
            .eq('id', requestId);

        if (updateError) throw updateError;

        // Update application status
        await supabase
            .from('applications')
            .update({
                status: 'document_verification',
                updated_at: new Date().toISOString()
            })
            .eq('id', docRequest.application_id);

        revalidatePath('/dashboard/applications');
        revalidatePath('/admin/applications'); // Update admin list
        revalidatePath('/admin/applications/[id]'); // Update admin detail page
        return { success: true, fileUrl: publicUrl };
    } catch (error: any) {
        console.error('Error uploading document:', error);
        return { error: error.message };
    }
}

export async function processCardPayment(
    transactionId: string,
    paymentMethodId: string
) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    try {
        // Get transaction details
        const { data: transaction, error: fetchError } = await supabase
            .from('payment_transactions')
            .select('amount, currency, application_id')
            .eq('id', transactionId)
            .single();

        if (fetchError) throw fetchError;

        // TODO: Integrate with Stripe
        // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        // const paymentIntent = await stripe.paymentIntents.create({
        //   amount: transaction.amount * 100, // Convert to cents
        //   currency: transaction.currency.toLowerCase(),
        //   payment_method: paymentMethodId,
        //   confirm: true,
        // });

        // For now, just update the status
        const { error: updateError } = await supabase
            .from('payment_transactions')
            .update({
                payment_method: 'card',
                status: 'completed',
                // stripe_payment_intent_id: paymentIntent.id,
                updated_at: new Date().toISOString()
            })
            .eq('id', transactionId);

        if (updateError) throw updateError;

        // Update application status
        if (transaction.application_id) {
            await supabase
                .from('applications')
                .update({
                    status: 'payment_verification', // Or 'payment_completed' if you want to skip verification
                    updated_at: new Date().toISOString()
                })
                .eq('id', transaction.application_id);
        }

        revalidatePath('/dashboard/applications');
        revalidatePath('/admin/applications'); // Update admin list
        revalidatePath('/admin/applications/[id]'); // Update admin detail page
        return { success: true };
    } catch (error: any) {
        console.error('Error processing payment:', error);
        return { error: error.message };
    }
}
