-- =====================================================
-- UPDATE LANGUAGE REQUIREMENTS TO "ALL" LEVELS
-- =====================================================
-- Option 2: Replace level-specific with generic requirements
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Remove old level-specific language requirements
DELETE FROM university_admission_requirements 
WHERE requirement_id IN (
    SELECT id FROM admission_requirements_catalog 
    WHERE title IN ('IELTS 6.0', 'IELTS 6.5', 'TOEFL 80', 'TOEFL 90', 'HSK 4', 'HSK 5', 'HSK 6')
);

DELETE FROM admission_requirements_catalog 
WHERE title IN ('IELTS 6.0', 'IELTS 6.5', 'TOEFL 80', 'TOEFL 90', 'HSK 4', 'HSK 5', 'HSK 6');

-- Step 2: Insert new generic language requirements
INSERT INTO admission_requirements_catalog (title, category, requirement_type, description, is_common) VALUES
('IELTS', 'language', 'all', 'IELTS score required for English-taught programs (minimum 6.0 for Bachelor, 6.5 for Master)', true),
('TOEFL', 'language', 'all', 'TOEFL iBT score required for English-taught programs (minimum 80 for Bachelor, 90 for Master)', true),
('HSK', 'language', 'all', 'HSK Level required for Chinese-taught programs (Level 4+ for Bachelor, Level 5+ for Master, Level 6 for PhD)', true),
('PTE Academic', 'language', 'all', 'PTE Academic score for English-taught programs', true),
('Duolingo English Test', 'language', 'all', 'Duolingo English Test score for English-taught programs', true);

-- Step 3: Verify the changes
SELECT 
    title,
    category,
    requirement_type,
    description
FROM admission_requirements_catalog
WHERE category = 'language'
ORDER BY title;

-- =====================================================
-- RESULT
-- =====================================================
-- Now you have:
-- - IELTS (all)
-- - TOEFL (all)
-- - HSK (all)
-- - PTE Academic (all)
-- - Duolingo English Test (all)
-- - English Proficiency Waiver (all)
--
-- These will appear for ALL program levels (Bachelor, Master, PhD)
-- Use custom notes to specify different scores per level
-- =====================================================
