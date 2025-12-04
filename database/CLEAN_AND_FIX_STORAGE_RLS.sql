-- =====================================================
-- MASTER FIX: CLEAN AND REBUILD STORAGE RLS
-- =====================================================
-- This script removes ALL duplicate/conflicting storage policies
-- and creates a clean set for 'profile-photos' and 'application-documents'.
-- =====================================================

-- 1. DROP ALL EXISTING/CONFLICTING POLICIES
-- -----------------------------------------
-- We drop policies for 'documents', 'profile-photos', and 'application-documents'
-- to ensure a clean slate.

-- 'documents' bucket (seems unused/old, but cleaning up)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can read documents" ON storage.objects;

-- 'profile-photos' bucket
DROP POLICY IF EXISTS "Public can view profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photo" ON storage.objects;

-- 'application-documents' bucket
DROP POLICY IF EXISTS "Users can upload application documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own application documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own application documents" ON storage.objects;


-- 2. CREATE CLEAN POLICIES FOR 'profile-photos'
-- ---------------------------------------------
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


-- 3. CREATE CLEAN POLICIES FOR 'application-documents'
-- ----------------------------------------------------
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
