-- =====================================================
-- FIX MISSING COLUMNS AND RELOAD CACHE
-- =====================================================

-- 1. Add potentially missing Requirement columns
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS gpa_requirement VARCHAR(255);
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS english_requirement VARCHAR(255);
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS min_age INTEGER;
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS max_age INTEGER;

-- 2. Add potentially missing Language Score columns
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS score_ielts NUMERIC(3,1) DEFAULT NULL;
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS score_toefl INTEGER DEFAULT NULL;
ALTER TABLE university_programs ADD COLUMN IF NOT EXISTS score_duolingo INTEGER DEFAULT NULL;

-- 3. Force Schema Cache Reload
-- This is critical for Supabase API to see the new columns
NOTIFY pgrst, 'reload schema';

-- 4. Verify (Optional checking comment)
COMMENT ON COLUMN university_programs.gpa_requirement IS 'Minimum GPA required';
COMMENT ON COLUMN university_programs.score_duolingo IS 'Minimum Duolingo score required';
