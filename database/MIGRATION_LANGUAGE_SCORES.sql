-- =====================================================
-- LANGUAGE SCORES MIGRATION
-- =====================================================
-- Adds specific score columns to university_programs table
-- and updates the main view.

-- 1. Add score columns
ALTER TABLE university_programs 
ADD COLUMN IF NOT EXISTS score_ielts NUMERIC(3,1) DEFAULT NULL,    -- e.g., 6.5
ADD COLUMN IF NOT EXISTS score_toefl INTEGER DEFAULT NULL,         -- e.g., 80
ADD COLUMN IF NOT EXISTS score_duolingo INTEGER DEFAULT NULL;      -- e.g., 105

-- 2. Update the v_university_programs_full view
-- Note: Must DROP first to update columns
DROP VIEW IF EXISTS v_university_programs_full;

CREATE VIEW v_university_programs_full AS
SELECT 
    up.id,
    up.slug,
    up.university_id,
    u.name as university_name,
    u.slug as university_slug,
    u.city,
    u.province,
    u.portal_key,
    pc.id as program_catalog_id,
    pc.title as program_title,
    pc.category,
    pc.field,
    pc.level,
    pc.description as program_description,
    up.custom_title,
    COALESCE(up.custom_title, pc.title) as display_title,
    up.tuition_fee,
    up.currency,
    COALESCE(up.duration, pc.typical_duration) as duration,
    up.language_id,
    l.name as language_name,
    up.intake,
    up.scholarship_chance,
    up.application_fee,
    up.service_fee,
    up.force_payment,
    up.is_active,
    up.application_deadline, -- Ensure this is included as checked previously
    up.gpa_requirement,
    -- New score columns
    up.score_ielts,
    up.score_toefl,
    up.score_duolingo,
    up.created_at,
    up.updated_at
FROM university_programs up
JOIN program_catalog pc ON up.program_catalog_id = pc.id
JOIN universities u ON up.university_id = u.id
LEFT JOIN languages l ON up.language_id = l.id;

-- 3. Add comments for clarity
COMMENT ON COLUMN university_programs.score_ielts IS 'Minimum IELTS score required (e.g. 6.0)';
COMMENT ON COLUMN university_programs.score_toefl IS 'Minimum TOEFL score required (e.g. 80)';
COMMENT ON COLUMN university_programs.score_duolingo IS 'Minimum Duolingo score required (e.g. 100)';
