-- ============================================
-- MIGRATION: Add overview & curriculum to program_translations
-- ============================================
-- Adds AI-generated overview text and core curriculum (course list)
-- to the existing program_translations table.
-- Run in Supabase SQL Editor.

-- 1. Add overview column (rich 5-6 sentence description)
ALTER TABLE program_translations
    ADD COLUMN IF NOT EXISTS overview TEXT;

-- 2. Add curriculum column (JSON array of course name strings)
ALTER TABLE program_translations
    ADD COLUMN IF NOT EXISTS curriculum JSONB DEFAULT '[]'::jsonb;

-- 3. Add comments
COMMENT ON COLUMN program_translations.overview
    IS 'AI-generated detailed program overview (5-6 sentences)';
COMMENT ON COLUMN program_translations.curriculum
    IS 'AI-generated array of core course names, e.g. ["Advanced Microeconomics","Econometrics"]';
