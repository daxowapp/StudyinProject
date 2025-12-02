-- Drop view if exists
DROP VIEW IF EXISTS v_universities_search;

-- Create comprehensive view for university search
CREATE OR REPLACE VIEW v_universities_search AS
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
    u.features,
    u.has_fast_track,
    COALESCE(s.program_count, 0) as program_count,
    s.min_tuition_fee,
    s.currency
FROM 
    universities u
LEFT JOIN 
    v_university_stats s ON u.id = s.university_id;

-- Grant access (if needed, usually public has access to views if underlying tables are accessible, or need explicit grant)
-- GRANT SELECT ON v_universities_search TO anon, authenticated;
