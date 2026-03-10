-- ============================================
-- Scholarship Programs View
-- ============================================
-- Cross-joins programs with university scholarships to show
-- what each program costs under each scholarship type.
-- This avoids duplicating program data in a separate table.

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
WHERE up.is_active = true;

-- Grant permissions
GRANT SELECT ON v_scholarship_programs TO anon, authenticated, service_role;

-- Force schema reload
NOTIFY pgrst, 'reload schema';

COMMENT ON VIEW v_scholarship_programs IS 'Cross-join of programs and university scholarships showing per-program scholarship options with calculated student costs';
