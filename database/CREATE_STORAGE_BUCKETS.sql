-- =====================================================
-- CREATE STORAGE BUCKETS FOR PROFILE PHOTOS
-- =====================================================
-- Run this in Supabase Dashboard → Storage
-- Or use the Supabase UI to create the bucket
-- =====================================================

-- Note: Storage buckets are typically created via Supabase Dashboard UI
-- Go to: Storage → Create a new bucket

-- Bucket name: profile-photos
-- Public: Yes (so photos can be displayed)
-- File size limit: 5MB
-- Allowed MIME types: image/*

-- If using SQL (advanced):
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('profile-photos', 'profile-photos', true);

-- RLS Policies for profile-photos bucket:
-- 1. Allow users to upload their own photos
-- 2. Allow public read access

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Check if bucket exists:
-- SELECT * FROM storage.buckets WHERE name = 'profile-photos';
