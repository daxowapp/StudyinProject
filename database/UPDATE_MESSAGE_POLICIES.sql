-- =====================================================
-- UPDATE MESSAGE POLICIES (Safe to run multiple times)
-- =====================================================
-- This script drops existing policies and recreates them
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop all existing policies for application_messages
DROP POLICY IF EXISTS "Students can view their application messages" ON application_messages;
DROP POLICY IF EXISTS "Students can send messages" ON application_messages;
DROP POLICY IF EXISTS "Students can send messages to their applications" ON application_messages;
DROP POLICY IF EXISTS "Admins can send messages" ON application_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON application_messages;
DROP POLICY IF EXISTS "Admins can update messages" ON application_messages;
DROP POLICY IF EXISTS "Students can update their messages" ON application_messages;

-- =====================================================
-- CREATE NEW POLICIES
-- =====================================================

-- 1. Students can view their application messages
CREATE POLICY "Students can view their application messages"
    ON application_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM applications a
            WHERE a.id = application_messages.application_id
            AND a.student_id = auth.uid()
        )
    );

-- 2. Students can send messages to their applications
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

-- 3. Admins can send messages to students
CREATE POLICY "Admins can send messages"
    ON application_messages FOR INSERT
    WITH CHECK (
        sender_type = 'admin'
        AND sender_id = auth.uid()
        AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 4. Admins can view all messages
CREATE POLICY "Admins can view all messages"
    ON application_messages FOR SELECT
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 5. Admins can update messages
CREATE POLICY "Admins can update messages"
    ON application_messages FOR UPDATE
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 6. Students can update their messages (mark as read)
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

SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies
WHERE tablename = 'application_messages'
ORDER BY policyname;

-- =====================================================
-- Expected Result: 6 policies
-- =====================================================
-- 1. Admins can send messages (INSERT)
-- 2. Admins can update messages (UPDATE)
-- 3. Admins can view all messages (SELECT)
-- 4. Students can send messages to their applications (INSERT)
-- 5. Students can update their messages (UPDATE)
-- 6. Students can view their application messages (SELECT)
-- =====================================================
