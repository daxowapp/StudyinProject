-- =====================================================
-- FIX RLS POLICIES FOR EMAIL NOTIFICATIONS
-- =====================================================
-- This allows the system to insert email notification logs
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their notifications" ON email_notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON email_notifications;
DROP POLICY IF EXISTS "Admins can view all notifications" ON email_notifications;

-- =====================================================
-- CREATE NEW POLICIES
-- =====================================================

-- 1. Allow system/service role to insert email notifications
-- This is needed when sending emails from server actions
CREATE POLICY "System can insert notifications"
    ON email_notifications FOR INSERT
    WITH CHECK (true);  -- Allow all inserts (server-side only)

-- 2. Users can view their own email notifications
CREATE POLICY "Users can view their notifications"
    ON email_notifications FOR SELECT
    USING (recipient_id = auth.uid());

-- 3. Admins can view all email notifications
CREATE POLICY "Admins can view all notifications"
    ON email_notifications FOR SELECT
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 4. Admins can update email notifications (mark as sent, etc.)
CREATE POLICY "Admins can update notifications"
    ON email_notifications FOR UPDATE
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- =====================================================
-- VERIFY POLICIES
-- =====================================================

SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies
WHERE tablename = 'email_notifications'
ORDER BY policyname;

-- =====================================================
-- Expected Result: 4 policies
-- =====================================================
-- 1. Admins can update notifications (UPDATE)
-- 2. Admins can view all notifications (SELECT)
-- 3. System can insert notifications (INSERT)
-- 4. Users can view their notifications (SELECT)
-- =====================================================
