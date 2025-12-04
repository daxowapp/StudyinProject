-- =====================================================
-- FIX: Add Admin RLS Policies
-- =====================================================
-- This script adds policies to allow admins to view/manage
-- all profiles and student documents.
-- =====================================================

-- 1. PROFILES TABLE
-- -----------------
-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

-- 2. STUDENT_DOCUMENTS TABLE
-- --------------------------
-- Allow admins to view all student documents
CREATE POLICY "Admins can view all student documents"
    ON student_documents FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

-- Allow admins to update all student documents (e.g. verify)
CREATE POLICY "Admins can update all student documents"
    ON student_documents FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

-- Allow admins to delete student documents
CREATE POLICY "Admins can delete all student documents"
    ON student_documents FOR DELETE
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT tablename, policyname 
FROM pg_policies 
WHERE policyname LIKE 'Admins%'
ORDER BY tablename;
