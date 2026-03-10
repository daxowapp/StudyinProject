-- =====================================================
-- MIGRATION: Add CSCA Exam Requirement to Programs
-- =====================================================

-- 1. Add csca_exam_require boolean to university_programs
ALTER TABLE university_programs 
ADD COLUMN IF NOT EXISTS csca_exam_require BOOLEAN DEFAULT false;

-- 2. Update v_university_programs_full view to pass the column through
DROP VIEW IF EXISTS v_university_programs_full CASCADE;

CREATE OR REPLACE VIEW v_university_programs_full AS
SELECT 
    up.id,
    up.slug,
    up.university_id,
    u.name as university_name,
    u.slug as university_slug,
    u.city,
    u.province,
    u.portal_key,  -- Added for multi-portal filtering
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
    up.csca_exam_require, -- New mapping
    up.created_at,
    up.updated_at
FROM university_programs up
JOIN program_catalog pc ON up.program_catalog_id = pc.id
JOIN universities u ON up.university_id = u.id
LEFT JOIN languages l ON up.language_id = l.id;

-- 3. Update v_scholarship_programs view to pass the column through
DROP VIEW IF EXISTS v_scholarship_programs;

CREATE OR REPLACE VIEW v_scholarship_programs AS
SELECT
    -- Program fields
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
    up.csca_exam_require, -- New mapping
    -- University fields
    up.university_id,
    up.university_name,
    up.university_slug,
    up.city,
    up.province,
    up.portal_key,
    -- Scholarship fields
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
    -- Calculated: what student pays after scholarship
    ROUND(up.tuition_fee * (1 - us.tuition_coverage_percentage / 100.0), 2) AS student_pays_tuition
FROM v_university_programs_full up
JOIN university_scholarships us
    ON us.university_id = up.university_id
    AND us.is_active = true
    -- Ensure the scholarship either has no strict program requirements (NULL/empty)
    -- OR this specific program's ID is in the applicable_programs array
    AND (
        us.applicable_programs IS NULL 
        OR array_length(us.applicable_programs, 1) IS NULL
        OR up.id = ANY(us.applicable_programs)
    )
WHERE up.is_active = true;

-- 4. Grant permissions
GRANT SELECT ON v_university_programs_full TO anon, authenticated, service_role;
GRANT SELECT ON v_scholarship_programs TO anon, authenticated, service_role;

-- 5. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
