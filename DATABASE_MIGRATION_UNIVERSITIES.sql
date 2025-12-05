-- =====================================================
-- UNIVERSITIES TABLE - DATABASE MIGRATION
-- =====================================================
-- This migration adds all new columns to the universities table
-- =====================================================

-- Add new columns to universities table
ALTER TABLE universities 
ADD COLUMN IF NOT EXISTS name_local VARCHAR(255),
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS province VARCHAR(100),
ADD COLUMN IF NOT EXISTS founded VARCHAR(50),
ADD COLUMN IF NOT EXISTS total_students VARCHAR(50),
ADD COLUMN IF NOT EXISTS international_students VARCHAR(50),
ADD COLUMN IF NOT EXISTS ranking VARCHAR(100),
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[],
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Create index on slug for better performance
CREATE INDEX IF NOT EXISTS idx_universities_slug ON universities(slug);

-- Create index on location for map queries
CREATE INDEX IF NOT EXISTS idx_universities_location ON universities(latitude, longitude);

-- Update existing universities with slugs if they don't have them
-- This generates slugs from the name field
UPDATE universities 
SET slug = LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE(
            REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+', '-', 'g'
        ),
        '-+', '-', 'g'
    )
)
WHERE slug IS NULL;

-- Sample data update (optional - update as needed)
-- Update Tsinghua University as example
UPDATE universities 
SET 
    name_local = '清华大学',
    founded = '1911',
    total_students = '50,000',
    international_students = '3,000',
    ranking = 'Top 20 Globally',
    features = ARRAY['Research University', 'Engineering Excellence', 'International Programs', 'Modern Campus'],
    latitude = 39.9997,
    longitude = 116.3267
WHERE name = 'Tsinghua University' AND slug = 'tsinghua-university';

-- Update Peking University as example
UPDATE universities 
SET 
    name_local = '北京大学',
    founded = '1898',
    total_students = '45,000',
    international_students = '2,500',
    ranking = 'Top 15 Globally',
    features = ARRAY['Comprehensive University', 'Liberal Arts', 'Sciences', 'Historic Campus'],
    latitude = 39.9925,
    longitude = 116.3059
WHERE name = 'Peking University' AND slug = 'peking-university';

-- Verify the changes
SELECT 
    name,
    slug,
    name_local,
    city,
    province,
    founded,
    total_students,
    latitude,
    longitude,
    array_length(features, 1) as feature_count,
    array_length(gallery_images, 1) as gallery_count
FROM universities
LIMIT 5;

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. Run this migration in your Supabase SQL Editor
-- 2. The slug column has a UNIQUE constraint
-- 3. Indexes are created for better query performance
-- 4. Existing data is preserved
-- 5. Sample data updates are provided as examples
-- =====================================================
