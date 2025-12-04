-- =====================================================
-- FIX STORAGE AND VERIFICATION SCRIPT
-- =====================================================

-- 1. MAKE BUCKET PUBLIC
-- This fixes the 404 error when viewing receipts/documents
UPDATE storage.buckets
SET public = true
WHERE name = 'documents';

-- 2. ADD STORAGE POLICIES
-- Ensure users can upload and view files

-- Allow public access to view files in 'documents' bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'documents' );

-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'documents' );

-- Allow users to update their own files (optional, but good for re-uploads)
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'documents' );

DO $$
BEGIN
    RAISE NOTICE '✅ Storage bucket updated to PUBLIC and policies applied!';
END $$;
