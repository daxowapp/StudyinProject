import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe (use a test key if env var is missing for now to prevent crash)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: "2025-11-17.clover" as any, // Cast to any to avoid strict type checking issues if types are slightly off, or use exact string from error
});

export async function POST(request: Request) {
    try {
        const { applicationId, amount, currency = "usd" } = await request.json();

        // In a real app, validate the application exists and amount is correct from DB

        // Create a Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: "Application Fee",
                            description: `Application ID: ${applicationId}`,
                        },
                        unit_amount: Math.round(amount * 100), // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${request.headers.get("origin")}/payment/success?session_id={CHECKOUT_SESSION_ID}&application_id=${applicationId}`,
            cancel_url: `${request.headers.get("origin")}/payment/cancelled`,
            metadata: {
                applicationId: applicationId,
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error: unknown) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
