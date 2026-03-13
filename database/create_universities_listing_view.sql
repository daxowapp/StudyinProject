-- =====================================================
-- CREATE v_universities_listing VIEW
-- Pre-aggregates program data per university for the
-- /universities listing page (eliminates N+1 join overhead)
-- =====================================================

DROP VIEW IF EXISTS v_universities_listing;

CREATE VIEW v_universities_listing AS
SELECT
    u.id,
    u.slug,
    u.name,
    u.city,
    u.province,
    u.logo_url,
    u.cover_photo_url,
    u.banner_url,
    u.ranking,
    u.university_type,
    u.institution_category,
    u.has_fast_track,
    u.features,
    u.portal_key,
    -- Aggregated program data
    COUNT(up.id)::int AS program_count,
    MIN(CASE WHEN up.tuition_fee > 0 THEN up.tuition_fee END) AS min_tuition_fee,
    (
        SELECT sub.currency
        FROM university_programs sub
        WHERE sub.university_id = u.id
          AND sub.tuition_fee > 0
        ORDER BY sub.tuition_fee ASC
        LIMIT 1
    ) AS min_tuition_currency,
    ARRAY_REMOVE(ARRAY_AGG(DISTINCT pc.level), NULL) AS available_levels,
    ARRAY_REMOVE(ARRAY_AGG(DISTINCT l.name), NULL) AS available_languages,
    BOOL_OR(
        up.scholarship_chance IS NOT NULL
        AND up.scholarship_chance != ''
        AND up.scholarship_chance != 'None'
    ) AS has_scholarship,
    BOOL_OR(up.csca_exam_require = true) AS has_csca_exam
FROM universities u
LEFT JOIN university_programs up ON up.university_id = u.id
LEFT JOIN program_catalog pc ON up.program_catalog_id = pc.id
LEFT JOIN languages l ON up.language_id = l.id
GROUP BY u.id;

-- Verify
SELECT * FROM v_universities_listing LIMIT 3;
