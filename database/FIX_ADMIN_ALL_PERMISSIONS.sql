-- =====================================================
-- FIX: COMPLETE ADMIN PERMISSIONS
-- =====================================================
-- This script ensures admins have full access to:
-- 1. Applications table
-- 2. Application Documents table
-- 3. Storage buckets (to download/view files)
-- =====================================================

-- Ensure is_admin function exists (idempotent)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. APPLICATIONS TABLE
-- ---------------------
DROP POLICY IF EXISTS "Admins can manage all applications" ON applications;
CREATE POLICY "Admins can manage all applications"
    ON applications
    FOR ALL
    USING (public.is_admin());

-- 2. APPLICATION_DOCUMENTS TABLE
-- ------------------------------
DROP POLICY IF EXISTS "Admins can manage all application documents" ON application_documents;
CREATE POLICY "Admins can manage all application documents"
    ON application_documents
    FOR ALL
    USING (public.is_admin());

-- 3. STORAGE PERMISSIONS
-- ----------------------
-- Allow admins to view ALL files in application-documents
DROP POLICY IF EXISTS "Admins can view all application documents" ON storage.objects;
CREATE POLICY "Admins can view all application documents"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'application-documents' AND 
        public.is_admin()
    );

-- Allow admins to delete ALL files in application-documents
DROP POLICY IF EXISTS "Admins can delete all application documents" ON storage.objects;
CREATE POLICY "Admins can delete all application documents"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'application-documents' AND 
        public.is_admin()
    );

-- Allow admins to upload to application-documents (if needed)
DROP POLICY IF EXISTS "Admins can upload application documents" ON storage.objects;
CREATE POLICY "Admins can upload application documents"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'application-documents' AND 
        public.is_admin()
    );

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT tablename, policyname 
FROM pg_policies 
WHERE policyname LIKE 'Admins%'
ORDER BY tablename;
