-- =====================================================
-- FIX: Update v_university_programs_full view
-- =====================================================
-- Run this in Supabase SQL Editor to fix the missing slug column
-- =====================================================

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
    up.created_at,
    up.updated_at
FROM university_programs up
JOIN program_catalog pc ON up.program_catalog_id = pc.id
JOIN universities u ON up.university_id = u.id
LEFT JOIN languages l ON up.language_id = l.id;

-- Verify the view was created successfully
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'v_university_programs_full'
ORDER BY ordinal_position;
