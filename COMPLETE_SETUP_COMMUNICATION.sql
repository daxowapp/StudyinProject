-- =====================================================
-- COMPLETE COMMUNICATION SYSTEM SETUP
-- =====================================================
-- This is a safe script that can be run multiple times
-- It will only create what doesn't exist and update policies
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: Update RLS Policies for Messages
-- =====================================================

-- Drop existing message policies
DROP POLICY IF EXISTS "Students can view their application messages" ON application_messages;
DROP POLICY IF EXISTS "Students can send messages" ON application_messages;
DROP POLICY IF EXISTS "Students can send messages to their applications" ON application_messages;
DROP POLICY IF EXISTS "Admins can send messages" ON application_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON application_messages;
DROP POLICY IF EXISTS "Admins can update messages" ON application_messages;
DROP POLICY IF EXISTS "Students can update their messages" ON application_messages;

-- Create message policies
CREATE POLICY "Students can view their application messages"
    ON application_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM applications a
            WHERE a.id = application_messages.application_id
            AND a.student_id = auth.uid()
        )
    );

CREATE POLICY "Students can send messages to their applications"
    ON application_messages FOR INSERT
    WITH CHECK (
        sender_type = 'student'
        AND sender_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM applications a
            WHERE a.id = application_id
            AND a.student_id = auth.uid()
        )
    );

CREATE POLICY "Admins can send messages"
    ON application_messages FOR INSERT
    WITH CHECK (
        sender_type = 'admin'
        AND sender_id = auth.uid()
        AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

CREATE POLICY "Admins can view all messages"
    ON application_messages FOR SELECT
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

CREATE POLICY "Admins can update messages"
    ON application_messages FOR UPDATE
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

CREATE POLICY "Students can update their messages"
    ON application_messages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM applications a
            WHERE a.id = application_messages.application_id
            AND a.student_id = auth.uid()
        )
    );

-- =====================================================
-- STEP 2: Update RLS Policies for Email Notifications
-- =====================================================

-- Drop existing email notification policies
DROP POLICY IF EXISTS "Users can view their notifications" ON email_notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON email_notifications;
DROP POLICY IF EXISTS "Admins can view all notifications" ON email_notifications;
DROP POLICY IF EXISTS "Admins can update notifications" ON email_notifications;

-- Create email notification policies
CREATE POLICY "System can insert notifications"
    ON email_notifications FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can view their notifications"
    ON email_notifications FOR SELECT
    USING (recipient_id = auth.uid());

CREATE POLICY "Admins can view all notifications"
    ON email_notifications FOR SELECT
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

CREATE POLICY "Admins can update notifications"
    ON email_notifications FOR UPDATE
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- =====================================================
-- STEP 3: Recreate Indexes (if needed)
-- =====================================================

-- Drop existing indexes (no error if they don't exist)
DROP INDEX IF EXISTS idx_messages_application;
DROP INDEX IF EXISTS idx_messages_sender;
DROP INDEX IF EXISTS idx_messages_unread;
DROP INDEX IF EXISTS idx_messages_requires_action;
DROP INDEX IF EXISTS idx_emails_recipient;
DROP INDEX IF EXISTS idx_emails_application;
DROP INDEX IF EXISTS idx_emails_status;
DROP INDEX IF EXISTS idx_emails_type;

-- Create indexes
CREATE INDEX idx_messages_application ON application_messages(application_id);
CREATE INDEX idx_messages_sender ON application_messages(sender_id);
CREATE INDEX idx_messages_unread ON application_messages(is_read) WHERE is_read = false;
CREATE INDEX idx_messages_requires_action ON application_messages(requires_action) WHERE requires_action = true;
CREATE INDEX idx_emails_recipient ON email_notifications(recipient_id);
CREATE INDEX idx_emails_application ON email_notifications(application_id);
CREATE INDEX idx_emails_status ON email_notifications(status);
CREATE INDEX idx_emails_type ON email_notifications(email_type);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check message policies
SELECT 'Message Policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'application_messages' ORDER BY policyname;

-- Check email notification policies
SELECT 'Email Notification Policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'email_notifications' ORDER BY policyname;

-- Check indexes
SELECT 'Indexes:' as info;
SELECT tablename, indexname FROM pg_indexes 
WHERE tablename IN ('application_messages', 'email_notifications')
ORDER BY tablename, indexname;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT '✅ Communication system setup complete!' as status;
SELECT '📧 Admins can now send messages to students' as info;
SELECT '🔔 Email notifications will be logged to database' as info;
