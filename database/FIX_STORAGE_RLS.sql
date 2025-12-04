-- =====================================================
-- FIX: STORAGE RLS POLICIES (Simplified)
-- =====================================================
-- This script fixes "row violates row-level security policy" 
-- specifically for FILE UPLOADS (Storage).
-- =====================================================

-- NOTE: We removed 'ALTER TABLE' as it requires superuser permissions.
-- Storage RLS is enabled by default in Supabase.

-- 1. Create policies for 'profile-photos' bucket
-- ---------------------------------------------
-- Drop existing policies to avoid conflicts (if you have permissions)
DROP POLICY IF EXISTS "Users can upload their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile photos" ON storage.objects;

-- Allow users to upload their own profile photos
CREATE POLICY "Users can upload their own profile photo"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own profile photos
CREATE POLICY "Users can update their own profile photo"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own profile photo
CREATE POLICY "Users can delete their own profile photo"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to view profile photos
CREATE POLICY "Public can view profile photos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-photos' );


-- 2. Create policies for 'application-documents' bucket
-- ----------------------------------------------------
DROP POLICY IF EXISTS "Users can upload application documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own application documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own application documents" ON storage.objects;

-- Allow users to upload their own documents
CREATE POLICY "Users can upload application documents"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'application-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own documents
CREATE POLICY "Users can view their own application documents"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'application-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete their own application documents"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'application-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
