# Setup Communication System

## 🚀 Quick Setup Guide

### Step 1: Create Database Tables

You need to run the SQL script to create the messaging and payment tables.

**Go to Supabase Dashboard:**
1. Open https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy and paste the entire content of `DATABASE_ADD_COMMUNICATION_PAYMENT.sql`
6. Click **Run** or press `Cmd/Ctrl + Enter`

This will create:
- ✅ `application_messages` table
- ✅ `payment_transactions` table
- ✅ `email_notifications` table
- ✅ `notification_preferences` table
- ✅ `document_requests` table
- ✅ `acceptance_letters` table
- ✅ `interview_schedules` table
- ✅ All triggers and RLS policies

### Step 2: Verify Tables Created

Run this query to check:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'application_messages',
    'payment_transactions',
    'email_notifications',
    'notification_preferences',
    'document_requests',
    'acceptance_letters',
    'interview_schedules'
);
```

You should see all 7 tables listed.

### Step 3: Test Messaging

Once tables are created, the admin can:
1. Go to admin dashboard
2. View an application
3. Send a message
4. Student will see it in their dashboard

---

## 📧 Email Notifications

Currently, emails are **logged to database** but not actually sent.

### To Enable Real Email Sending:

#### Option 1: Using Resend (Recommended)

1. **Sign up for Resend:**
   - Go to https://resend.com
   - Create account (free tier: 100 emails/day)
   - Get API key

2. **Install Resend:**
   ```bash
   npm install resend
   ```

3. **Add to `.env.local`:**
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

4. **Uncomment code in `/src/lib/email/service.ts`:**
   ```typescript
   // Find this section and uncomment:
   const resend = new Resend(process.env.RESEND_API_KEY);
   const { data, error } = await resend.emails.send({
     from: 'StudyAtChina <noreply@studyatchina.com>',
     to: params.to,
     subject: params.subject,
     html: params.html,
     text: params.text,
   });
   ```

5. **Update status from 'sent' to 'pending':**
   ```typescript
   status: 'pending', // Will be 'sent' after Resend confirms
   ```

#### Option 2: Using SendGrid

1. Sign up at https://sendgrid.com
2. Get API key
3. Install: `npm install @sendgrid/mail`
4. Add to `.env.local`: `SENDGRID_API_KEY=xxx`
5. Update `/src/lib/email/service.ts` to use SendGrid

---

## 🔍 Troubleshooting

### "No messages showing for student"

**Check:**
1. ✅ Tables created in database
2. ✅ Message was actually created (check Supabase table)
3. ✅ Student is logged in with correct account
4. ✅ RLS policies allow student to see their messages

**Verify message exists:**
```sql
SELECT * FROM application_messages 
WHERE application_id = 'your-application-id';
```

### "Email not sent"

**Current behavior:**
- Emails are logged to `email_notifications` table
- Status will be 'sent' (but not actually sent)
- To actually send, integrate Resend or SendGrid (see above)

**Check email logs:**
```sql
SELECT * FROM email_notifications 
ORDER BY created_at DESC 
LIMIT 10;
```

### "Student can't see messages"

**Check RLS policy:**
```sql
-- This should return the student's messages
SELECT m.* 
FROM application_messages m
JOIN applications a ON a.id = m.application_id
WHERE a.student_id = 'student-user-id';
```

---

## 📱 Admin Send Message Feature

Currently, the admin dashboard doesn't have a UI to send messages yet.

### Quick Fix: Add Message Sending to Admin

I'll create this for you now...
