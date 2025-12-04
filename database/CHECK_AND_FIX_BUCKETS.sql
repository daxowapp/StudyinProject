-- =====================================================
-- FIX: ENSURE STORAGE BUCKETS EXIST
-- =====================================================
-- This script ensures the required buckets exist and are public.
-- =====================================================

-- 1. Create 'profile-photos' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 2. Create 'application-documents' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('application-documents', 'application-documents', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 3. Verify buckets
SELECT id, name, public, created_at, updated_at
FROM storage.buckets
WHERE id IN ('profile-photos', 'application-documents');
