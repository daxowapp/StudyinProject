-- =====================================================
-- FINAL FIX: STORAGE RLS (Explicit Roles)
-- =====================================================
-- This script recreates the storage policies with explicit
-- 'authenticated' role assignment to ensure they work correctly.
-- =====================================================

-- 1. DROP EXISTING POLICIES
-- -------------------------
DROP POLICY IF EXISTS "Users can upload their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile photos" ON storage.objects;

DROP POLICY IF EXISTS "Users can upload application documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own application documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own application documents" ON storage.objects;


-- 2. PROFILE PHOTOS (bucket: 'profile-photos')
-- --------------------------------------------

-- INSERT: Authenticated users can upload to their own folder
CREATE POLICY "Users can upload their own profile photo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- UPDATE: Authenticated users can update their own files
CREATE POLICY "Users can update their own profile photo"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- DELETE: Authenticated users can delete their own files
CREATE POLICY "Users can delete their own profile photo"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- SELECT: Public can view all profile photos
CREATE POLICY "Public can view profile photos"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'profile-photos' );


-- 3. APPLICATION DOCUMENTS (bucket: 'application-documents')
-- ----------------------------------------------------------

-- INSERT: Authenticated users can upload to their own folder
CREATE POLICY "Users can upload application documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'application-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- SELECT: Authenticated users can view their own files
CREATE POLICY "Users can view their own application documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'application-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- DELETE: Authenticated users can delete their own files
CREATE POLICY "Users can delete their own application documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'application-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
