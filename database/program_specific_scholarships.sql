-- 1. Add applicable_programs array to allow restricting scholarships to specific programs
ALTER TABLE university_scholarships 
ADD COLUMN IF NOT EXISTS applicable_programs UUID[] DEFAULT NULL;

-- 2. Recreate the view to take applicable_programs into account
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

-- 3. Grant permissions
GRANT SELECT ON v_scholarship_programs TO anon, authenticated, service_role;

-- 4. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

COMMENT ON VIEW v_scholarship_programs IS 'Cross-join of programs and university scholarships showing per-program scholarship options, filtered by applicable_programs mapping.';
