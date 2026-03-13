-- =====================================================
-- FIX: Add entry_requirements column to v_university_programs_full
-- Date: 2026-03-12
-- Issue: entry_requirements is saved in university_programs but NOT in the view.
-- =====================================================

-- 1. Drop dependent views first, then recreate
DROP VIEW IF EXISTS v_scholarship_programs;
DROP VIEW IF EXISTS v_university_programs_full CASCADE;

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
    up.csca_exam_require,
    up.has_custom_requirements,
    -- Score / requirement columns
    up.gpa_requirement,
    up.application_deadline,
    up.score_ielts,
    up.score_toefl,
    up.score_duolingo,
    -- Entry requirements text (NEW)
    up.entry_requirements,
    -- Timestamps
    up.created_at,
    up.updated_at
FROM university_programs up
JOIN program_catalog pc ON up.program_catalog_id = pc.id
JOIN universities u ON up.university_id = u.id
LEFT JOIN languages l ON up.language_id = l.id;

-- 2. Recreate v_scholarship_programs (depends on v_university_programs_full)
CREATE OR REPLACE VIEW v_scholarship_programs AS
SELECT
    up.id AS program_id,
    up.slug AS program_slug,
    up.display_title,
    up.program_title,
    up.level,
    up.duration,
    up.tuition_fee,
    up.currency,
    up.language_name,
    up.intake,
    up.category,
    up.field,
    up.is_active,
    up.csca_exam_require,
    up.gpa_requirement,
    up.application_deadline,
    up.score_ielts,
    up.score_toefl,
    up.score_duolingo,
    up.university_id,
    up.university_name,
    up.university_slug,
    up.city,
    up.province,
    up.portal_key,
    us.id AS scholarship_id,
    us.type_name AS scholarship_type,
    us.display_name AS scholarship_display_name,
    us.description AS scholarship_description,
    us.tuition_coverage_percentage,
    us.includes_accommodation,
    us.accommodation_type,
    us.includes_stipend,
    us.stipend_amount_monthly,
    us.stipend_currency,
    us.includes_medical_insurance,
    us.service_fee_usd,
    us.service_fee_cny,
    us.duration_years AS scholarship_duration_years,
    us.is_popular,
    ROUND(up.tuition_fee * (1 - us.tuition_coverage_percentage / 100.0), 2) AS student_pays_tuition
FROM v_university_programs_full up
JOIN university_scholarships us
    ON us.university_id = up.university_id
    AND us.is_active = true
    AND (
        us.applicable_programs IS NULL 
        OR array_length(us.applicable_programs, 1) IS NULL
        OR up.id = ANY(us.applicable_programs)
    )
WHERE up.is_active = true;

-- 3. Grant permissions
GRANT SELECT ON v_university_programs_full TO anon, authenticated, service_role;
GRANT SELECT ON v_scholarship_programs TO anon, authenticated, service_role;

-- 4. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
