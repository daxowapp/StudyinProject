
-- Secure the universities bucket
-- 1. Remove the "Allow All" policy (assuming user named it 'Allow All' or similar, but policies are dropped by name)
-- Actually, we can just drop ALL policies on this bucket to be safe and start fresh.

BEGIN;

-- Drop existing policies for storage.objects
DROP POLICY IF EXISTS "Allow All" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects; -- just in case
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects; -- just in case

-- Create explicit policies
-- 1. Public Read Access (Anyone can view images)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'universities' );

-- 2. Authenticated Upload Access (Only logged in users can upload)
CREATE POLICY "Authenticated Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'universities' );

-- 3. Authenticated Update/Delete (Optional: allow users to update their uploads? usually for admin)
-- For now, let's allow authenticated users to update/delete in this bucket.
CREATE POLICY "Authenticated Update Access"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'universities' );

CREATE POLICY "Authenticated Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'universities' );

COMMIT;
