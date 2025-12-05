import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
    searchParams: Promise<{ session_id?: string; application_id?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
    const { session_id, application_id } = await searchParams;

    let paymentVerified = false;
    let amount = 0;
    let currency = "usd";
    let errorMessage = "";

    if (session_id && process.env.STRIPE_SECRET_KEY) {
        try {
            // Initialize Stripe lazily to avoid build errors
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                apiVersion: "2025-11-17.clover" as any,
            });

            // Verify the session with Stripe
            const session = await stripe.checkout.sessions.retrieve(session_id);

            if (session.payment_status === "paid") {
                paymentVerified = true;
                amount = (session.amount_total || 0) / 100;
                currency = session.currency || "usd";

                // Update the payment transaction in database
                const supabase = await createClient();

                // Find and update payment transaction
                if (application_id) {
                    const { error: updateError } = await supabase
                        .from("payment_transactions")
                        .update({
                            status: "completed",
                            payment_method: "card",
                            stripe_session_id: session_id,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", application_id);

                    if (updateError) {
                        console.error("Error updating payment:", updateError);
                    }

                    // Also update application status
                    await supabase
                        .from("applications")
                        .update({
                            status: "submitted",
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", application_id);

                    // Send emails
                    try {
                        const { sendPaymentSuccessEmail, sendAdminNewPaymentEmail } = await import('@/lib/email/service');
                        const { data: appData } = await supabase.from('applications').select('student_id, student_email, student_name').eq('id', application_id).single();

                        if (appData) {
                            // 1. To Student
                            await sendPaymentSuccessEmail({
                                studentId: appData.student_id,
                                studentEmail: appData.student_email,
                                studentName: appData.student_name,
                                amount: amount,
                                currency: currency,
                                applicationId: application_id
                            });

                            // 2. To Admin
                            await sendAdminNewPaymentEmail({
                                studentName: appData.student_name,
                                amount: amount,
                                currency: currency,
                                applicationId: application_id
                            });
                        }
                    } catch (e) {
                        console.error("Failed to send payment emails:", e);
                    }
                }
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            errorMessage = "Unable to verify payment. Please contact support.";
        }
    }

    if (!paymentVerified && !errorMessage) {
        errorMessage = "No payment session found.";
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="max-w-md w-full text-center border-none shadow-xl">
                <CardHeader>
                    {paymentVerified ? (
                        <>
                            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-green-700">Payment Successful!</CardTitle>
                        </>
                    ) : (
                        <>
                            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-red-700">Payment Verification Failed</CardTitle>
                        </>
                    )}
                </CardHeader>
                <CardContent>
                    {paymentVerified ? (
                        <>
                            <p className="text-muted-foreground mb-4">
                                Thank you for your payment. Your application has been successfully submitted.
                            </p>
                            <div className="bg-muted p-4 rounded-lg text-sm">
                                <div className="flex justify-between mb-2">
                                    <span>Session ID:</span>
                                    <span className="font-mono text-xs truncate max-w-32">
                                        {session_id?.slice(0, 20)}...
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Amount Paid:</span>
                                    <span>{currency.toUpperCase()} {amount.toFixed(2)}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-muted-foreground">
                            {errorMessage} If you believe this is an error, please contact our support team.
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Link href="/dashboard/applications" className="w-full">
                        <Button className="w-full">
                            {paymentVerified ? "View My Applications" : "Return to Applications"}
                        </Button>
                    </Link>
                    <Link href="/dashboard" className="w-full">
                        <Button variant="ghost" className="w-full">Return to Dashboard</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
