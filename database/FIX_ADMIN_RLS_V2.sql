-- =====================================================
-- FIX: Add Admin RLS Policies (V2 - Recursion Safe)
-- =====================================================
-- This script safely adds policies for admins using a
-- SECURITY DEFINER function to avoid infinite recursion.
-- =====================================================

-- 1. Create is_admin() function
-- -----------------------------
-- This function runs with the privileges of the creator (superuser)
-- allowing it to bypass RLS to check the user's role.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. PROFILES TABLE
-- -----------------
-- Allow admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (public.is_admin());

-- Allow admins to update all profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    USING (public.is_admin());

-- 3. STUDENT_DOCUMENTS TABLE
-- --------------------------
-- Allow admins to view all student documents
DROP POLICY IF EXISTS "Admins can view all student documents" ON student_documents;
CREATE POLICY "Admins can view all student documents"
    ON student_documents FOR SELECT
    USING (public.is_admin());

-- Allow admins to update all student documents (e.g. verify)
DROP POLICY IF EXISTS "Admins can update all student documents" ON student_documents;
CREATE POLICY "Admins can update all student documents"
    ON student_documents FOR UPDATE
    USING (public.is_admin());

-- Allow admins to delete student documents
DROP POLICY IF EXISTS "Admins can delete all student documents" ON student_documents;
CREATE POLICY "Admins can delete all student documents"
    ON student_documents FOR DELETE
    USING (public.is_admin());

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT tablename, policyname 
FROM pg_policies 
WHERE policyname LIKE 'Admins%'
ORDER BY tablename;
