# Google OAuth Setup Guide

## Prerequisites

Before Google OAuth will work, you need to configure it in your Supabase project.

## Setup Steps

### 1. Enable Google Provider in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click to expand
4. Toggle **Enable Sign in with Google** to ON

### 2. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if prompted
6. Select **Web application** as the application type
7. Add authorized redirect URIs:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   Replace `<your-project-ref>` with your actual Supabase project reference

### 3. Configure Supabase with Google Credentials

1. Copy the **Client ID** and **Client Secret** from Google Cloud Console
2. Go back to Supabase Dashboard → **Authentication** → **Providers** → **Google**
3. Paste the **Client ID** in the appropriate field
4. Paste the **Client Secret** in the appropriate field
5. Click **Save**

### 4. Set Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Or your production URL: https://yourdomain.com
```

### 5. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/auth/login` or `/auth/register`
3. Click the **Continue with Google** button
4. You should be redirected to Google's OAuth consent screen
5. After authorizing, you'll be redirected back to your app

## How It Works

### Login Flow

1. User clicks "Continue with Google" button
2. `loginWithGoogle()` server action is called
3. Supabase initiates OAuth flow with Google
4. User is redirected to Google's consent screen
5. After authorization, Google redirects to `/auth/callback`
6. Callback route exchanges code for session
7. If it's a new user, a profile is automatically created
8. User is redirected to dashboard

### Profile Creation

For OAuth users, the callback handler automatically creates a profile if one doesn't exist:
- Extracts name from Google user metadata
- Splits into first name and last name
- Sets role to 'student'
- Creates profile record in database

## Troubleshooting

### "Authentication Error" Page

If users see the auth error page, check:
- Google OAuth credentials are correctly configured in Supabase
- Redirect URI matches exactly (including https/http)
- Google Cloud Console project has the OAuth consent screen configured
- User didn't cancel the authorization

### Profile Not Created

If OAuth login works but profile isn't created:
- Check Supabase logs for errors
- Verify the profiles table has proper RLS policies
- Ensure the callback route has permission to insert profiles

## Files Modified

- `src/app/(public)/auth/actions/index.ts` - Added `loginWithGoogle()` server action
- `src/app/(public)/auth/login/page.tsx` - Added Google OAuth button
- `src/app/(public)/auth/register/page.tsx` - Added Google OAuth button
- `src/app/(public)/auth/callback/route.ts` - OAuth callback handler (NEW)
- `src/app/(public)/auth/auth-error/page.tsx` - Error page (NEW)
