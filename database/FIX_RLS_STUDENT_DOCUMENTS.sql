-- =====================================================
-- FIX: Add RLS Policies for student_documents table
-- =====================================================
-- This fixes the "row violates row-level security policy" error
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Enable RLS on student_documents table
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;

-- 2. Allow students to view their own documents
CREATE POLICY "Students can view their own documents"
    ON student_documents FOR SELECT
    USING (auth.uid() = student_id);

-- 3. Allow students to insert their own documents
CREATE POLICY "Students can insert their own documents"
    ON student_documents FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- 4. Allow students to update their own documents
CREATE POLICY "Students can update their own documents"
    ON student_documents FOR UPDATE
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- 5. Allow students to delete their own documents
CREATE POLICY "Students can delete their own documents"
    ON student_documents FOR DELETE
    USING (auth.uid() = student_id);

-- 6. Allow admins to view all documents (optional)
-- Uncomment if you want admins to see all student documents
-- CREATE POLICY "Admins can view all documents"
--     ON student_documents FOR SELECT
--     USING (
--         EXISTS (
--             SELECT 1 FROM profiles
--             WHERE profiles.id = auth.uid()
--             AND profiles.role = 'admin'
--         )
--     );

-- 7. Allow admins to update verification status (optional)
-- Uncomment if you want admins to verify documents
-- CREATE POLICY "Admins can update document verification"
--     ON student_documents FOR UPDATE
--     USING (
--         EXISTS (
--             SELECT 1 FROM profiles
--             WHERE profiles.id = auth.uid()
--             AND profiles.role = 'admin'
--         )
--     );

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'student_documents';

-- Check policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'student_documents';

-- =====================================================
-- DONE!
-- =====================================================
-- Students can now upload, view, update, and delete their own documents
-- =====================================================
