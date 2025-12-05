-- =====================================================
-- FIX RLS POLICY FOR APPLICATION MESSAGES
-- =====================================================
-- This allows admins to send messages to students
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Students can send messages" ON application_messages;

-- Allow admins to insert messages (send to students)
CREATE POLICY "Admins can send messages"
    ON application_messages FOR INSERT
    WITH CHECK (
        sender_type = 'admin'
        AND sender_id = auth.uid()
        AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- Allow students to send messages (reply to admin)
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

-- Allow admins to view all messages
CREATE POLICY "Admins can view all messages"
    ON application_messages FOR SELECT
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- Allow admins to update messages (mark as read, etc.)
CREATE POLICY "Admins can update messages"
    ON application_messages FOR UPDATE
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- Allow students to update their messages (mark as read)
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
-- VERIFY POLICIES
-- =====================================================

-- Check all policies for application_messages
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'application_messages';

-- =====================================================
-- TEST QUERY (as admin)
-- =====================================================

-- This should now work when logged in as admin
-- INSERT INTO application_messages (
--     application_id,
--     sender_id,
--     sender_type,
--     message_type,
--     subject,
--     message
-- ) VALUES (
--     'your-application-id',
--     auth.uid(),
--     'admin',
--     'general',
--     'Test Subject',
--     'Test Message'
-- );
