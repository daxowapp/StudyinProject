-- Drop the view first to allow column structural changes
DROP VIEW IF EXISTS v_university_programs_full;

-- Recreate the view with the new columns
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
    INITCAP(pc.level) as level,
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
    up.application_deadline,
    up.is_active,
    up.has_custom_requirements,
    -- New columns
    up.gpa_requirement,
    up.english_requirement,
    up.min_age,
    up.max_age,
    up.score_ielts,
    up.score_toefl,
    up.score_duolingo,
    -- Timestamps
    up.created_at,
    up.updated_at
FROM university_programs up
JOIN program_catalog pc ON up.program_catalog_id = pc.id
JOIN universities u ON up.university_id = u.id
LEFT JOIN languages l ON up.language_id = l.id;

-- Grant permissions (since DROP removes them)
GRANT SELECT ON v_university_programs_full TO anon, authenticated, service_role;

-- Force schema reload
NOTIFY pgrst, 'reload schema';
