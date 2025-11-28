# Deployment Guide for StudyAtChina

This guide covers the steps to deploy the StudyAtChina application to production using Vercel, Supabase, and Stripe.

## Prerequisites

- [Vercel Account](https://vercel.com)
- [Supabase Account](https://supabase.com)
- [Stripe Account](https://stripe.com)
- GitHub Repository with the project code

## 1. Supabase Setup (Production)

1.  **Create a new Project**: Log in to Supabase and create a new project for production.
2.  **Database Schema**:
    - Go to the **SQL Editor**.
    - Copy the content of `supabase/schema.sql` from your local project.
    - Run the SQL query to create tables and policies.
3.  **Seed Data (Optional)**:
    - If you want initial data, run the content of `supabase/seed.sql`.
4.  **Get Credentials**:
    - Go to **Project Settings** -> **API**.
    - Copy the `Project URL` and `anon` public key.
    - Copy the `service_role` secret key (keep this safe!).

## 2. Stripe Setup (Production)

1.  **Activate Account**: Ensure your Stripe account is activated for production payments.
2.  **Get Keys**:
    - Go to **Developers** -> **API keys**.
    - Copy the `Publishable key` and `Secret key`.
3.  **Webhook (Optional)**:
    - If you implemented webhooks, configure the endpoint in Stripe to point to your production URL (e.g., `https://your-domain.com/api/webhooks/stripe`).

## 3. Vercel Deployment

1.  **Import Project**:
    - Log in to Vercel.
    - Click **Add New** -> **Project**.
    - Import your GitHub repository.
2.  **Configure Project**:
    - **Framework Preset**: Next.js
    - **Root Directory**: `./` (default)
3.  **Environment Variables**:
    - Add the following variables:
        - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
        - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
        - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key
        - `STRIPE_SECRET_KEY`: Your Stripe Secret Key
        - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe Publishable Key
        - `NEXT_PUBLIC_SITE_URL`: Your production domain (e.g., `https://studyatchina.com`)
4.  **Deploy**:
    - Click **Deploy**. Vercel will build and deploy your application.

## 4. Post-Deployment Checks

1.  **Auth**: Try signing up and logging in.
2.  **Database**: Verify that data is loading from your production Supabase project.
3.  **Payments**: Test a payment (use a real card for small amount or Stripe test card if in test mode).
4.  **Images**: Ensure all images (Unsplash, local assets) are loading correctly.

## Troubleshooting

- **Build Errors**: Check the Vercel logs. Common issues include missing dependencies or type errors.
- **Database Connection**: Verify your environment variables are correct.
- **CORS Issues**: Ensure your Supabase project allows requests from your production domain.
