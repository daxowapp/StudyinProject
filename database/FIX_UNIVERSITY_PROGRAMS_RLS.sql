-- =====================================================
-- FIX: Add Admin RLS Policies for university_programs
-- =====================================================
-- This script adds policies for admins to manage
-- university_programs table (create, read, update, delete).
-- =====================================================

-- Ensure the is_admin() function exists (from FIX_ADMIN_RLS_V2.sql)
-- If not, run that script first.

-- UNIVERSITY_PROGRAMS TABLE
-- -------------------------

-- Allow public read access (for listing programs on public pages)
DROP POLICY IF EXISTS "Anyone can view active programs" ON university_programs;
CREATE POLICY "Anyone can view active programs"
    ON university_programs FOR SELECT
    USING (is_active = true);

-- Allow admins to view all programs (including inactive)
DROP POLICY IF EXISTS "Admins can view all programs" ON university_programs;
CREATE POLICY "Admins can view all programs"
    ON university_programs FOR SELECT
    USING (public.is_admin());

-- Allow admins to insert programs
DROP POLICY IF EXISTS "Admins can insert programs" ON university_programs;
CREATE POLICY "Admins can insert programs"
    ON university_programs FOR INSERT
    WITH CHECK (public.is_admin());

-- Allow admins to update programs
DROP POLICY IF EXISTS "Admins can update programs" ON university_programs;
CREATE POLICY "Admins can update programs"
    ON university_programs FOR UPDATE
    USING (public.is_admin());

-- Allow admins to delete programs
DROP POLICY IF EXISTS "Admins can delete programs" ON university_programs;
CREATE POLICY "Admins can delete programs"
    ON university_programs FOR DELETE
    USING (public.is_admin());

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename = 'university_programs'
ORDER BY policyname;
