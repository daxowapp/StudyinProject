-- =====================================================
-- SUPABASE STORAGE BUCKET SETUP FOR ARTICLES
-- =====================================================
-- Run this in Supabase SQL Editor to create storage bucket
-- =====================================================

-- 1. Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'articles',
    'articles',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up storage policies for public read access
CREATE POLICY "Public can view article images"
ON storage.objects FOR SELECT
USING (bucket_id = 'articles');

-- 3. Allow authenticated users to upload article images
CREATE POLICY "Authenticated users can upload article images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'articles' 
    AND auth.role() = 'authenticated'
);

-- 4. Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update article images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'articles' 
    AND auth.role() = 'authenticated'
);

-- 5. Allow authenticated users to delete article images
CREATE POLICY "Authenticated users can delete article images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'articles' 
    AND auth.role() = 'authenticated'
);

-- =====================================================
-- ALTERNATIVE: If you prefer to use the 'public' bucket
-- =====================================================
-- Just make sure the 'public' bucket exists and has proper policies
-- You can check in Supabase Dashboard > Storage

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Check if bucket was created
SELECT * FROM storage.buckets WHERE id = 'articles';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%article%';
