CREATE OR REPLACE VIEW v_universities_listing AS
SELECT
    u.id,
    u.slug,
    u.name,
    u.city,
    u.province,
    CASE WHEN LEFT(u.logo_url, 5) = 'data:' THEN NULL ELSE u.logo_url END AS logo_url,
    CASE WHEN LEFT(u.cover_photo_url, 5) = 'data:' THEN NULL ELSE u.cover_photo_url END AS cover_photo_url,
    CASE WHEN LEFT(u.banner_url, 5) = 'data:' THEN NULL ELSE u.banner_url END AS banner_url,
    u.ranking,
    u.university_type,
    u.institution_category,
    u.has_fast_track,
    u.features,
    u.portal_key,
    COUNT(up.id) FILTER (WHERE up.is_active = true)::int AS program_count,
    MIN(CASE WHEN up.tuition_fee > 0 AND up.is_active = true THEN up.tuition_fee END) AS min_tuition_fee,
    (
        SELECT sub.currency
        FROM university_programs sub
        WHERE sub.university_id = u.id
          AND sub.is_active = true
          AND sub.tuition_fee > 0
        ORDER BY sub.tuition_fee ASC
        LIMIT 1
    ) AS min_tuition_currency,
    ARRAY_REMOVE(ARRAY_AGG(DISTINCT pc.level) FILTER (WHERE up.is_active = true), NULL) AS available_levels,
    ARRAY_REMOVE(ARRAY_AGG(DISTINCT l.name) FILTER (WHERE up.is_active = true), NULL) AS available_languages,
    BOOL_OR(
        up.is_active = true
        AND up.scholarship_chance IS NOT NULL
        AND up.scholarship_chance <> ''
        AND up.scholarship_chance <> 'None'
    ) AS has_scholarship,
    BOOL_OR(up.is_active = true AND up.csca_exam_require = true) AS has_csca_exam,
    ARRAY_REMOVE(ARRAY_AGG(DISTINCT pc.category) FILTER (WHERE up.is_active = true), NULL) AS available_program_categories
FROM universities u
LEFT JOIN university_programs up ON up.university_id = u.id
LEFT JOIN program_catalog pc ON up.program_catalog_id = pc.id
LEFT JOIN languages l ON up.language_id = l.id
GROUP BY u.id;
GRANT SELECT ON v_universities_listing TO anon, authenticated, service_role;
