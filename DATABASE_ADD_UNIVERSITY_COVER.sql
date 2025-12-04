-- =====================================================
-- ADD COVER PHOTO TO UNIVERSITIES TABLE
-- =====================================================
-- This migration adds a cover_photo_url column to universities
-- for hero sections and card banners
-- =====================================================

-- Add cover_photo_url column to universities table
ALTER TABLE universities 
ADD COLUMN IF NOT EXISTS cover_photo_url TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN universities.cover_photo_url IS 'URL for the university cover/banner photo used in hero sections and listing cards';

-- Note: You can now upload cover photos for each university in the admin panel
-- The cover photo will be displayed in:
-- 1. University listing page cards
-- 2. University detail page hero section

-- Verification
SELECT id, name, cover_photo_url, logo_url 
FROM universities 
LIMIT 5;
