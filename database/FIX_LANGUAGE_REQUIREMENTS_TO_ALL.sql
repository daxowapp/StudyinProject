-- =====================================================
-- FIX: Update Language Requirements to "all"
-- =====================================================
-- This makes language requirements appear for all program levels
-- Universities can use custom notes to specify different scores
-- =====================================================

-- Update IELTS requirements to "all"
UPDATE admission_requirements_catalog
SET requirement_type = 'all',
    description = 'IELTS score required for English-taught programs (minimum 6.0 for Bachelor, 6.5 for Master)'
WHERE title IN ('IELTS 6.0', 'IELTS 6.5');

-- Update TOEFL requirements to "all"
UPDATE admission_requirements_catalog
SET requirement_type = 'all',
    description = 'TOEFL iBT score required for English-taught programs (minimum 80 for Bachelor, 90 for Master)'
WHERE title IN ('TOEFL 80', 'TOEFL 90');

-- Update HSK requirements to "all"
UPDATE admission_requirements_catalog
SET requirement_type = 'all',
    description = 'HSK Level required for Chinese-taught programs (Level 4 for Bachelor, Level 5 for Master, Level 6 for PhD)'
WHERE title IN ('HSK 4', 'HSK 5', 'HSK 6');

-- OR: Better approach - Create generic language requirements
-- Delete the level-specific ones and create generic ones
DELETE FROM admission_requirements_catalog 
WHERE title IN ('IELTS 6.0', 'IELTS 6.5', 'TOEFL 80', 'TOEFL 90', 'HSK 4', 'HSK 5', 'HSK 6');

-- Insert generic language requirements
INSERT INTO admission_requirements_catalog (title, category, requirement_type, description, is_common) VALUES
('IELTS', 'language', 'all', 'IELTS score required for English-taught programs (minimum 6.0 for Bachelor, 6.5 for Master)', true),
('TOEFL', 'language', 'all', 'TOEFL iBT score required for English-taught programs (minimum 80 for Bachelor, 90 for Master)', true),
('HSK', 'language', 'all', 'HSK Level required for Chinese-taught programs (Level 4+ for Bachelor, Level 5+ for Master, Level 6 for PhD)', true);

-- Verify the changes
SELECT title, category, requirement_type, description
FROM admission_requirements_catalog
WHERE category = 'language'
ORDER BY title;
