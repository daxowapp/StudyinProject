-- =====================================================
-- FIX APPLICATION DEADLINE VISIBILITY
-- =====================================================

-- 1. Ensure the column exists in the base table
ALTER TABLE university_programs 
ADD COLUMN IF NOT EXISTS application_deadline DATE;

-- 2. Update the view to include the column
-- Note: We must DROP the view first to change its definition significantly
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
    up.application_deadline, -- Added this column
    up.is_active,
    up.has_custom_requirements,
    up.created_at,
    up.updated_at
FROM university_programs up
JOIN program_catalog pc ON up.program_catalog_id = pc.id
JOIN universities u ON up.university_id = u.id
LEFT JOIN languages l ON up.language_id = l.id;

-- 3. Verify
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'v_university_programs_full' 
AND column_name = 'application_deadline';
