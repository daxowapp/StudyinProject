-- =====================================================
-- MIGRATION: Add portal_key for multi-portal support
-- =====================================================
-- This migration adds portal_key column to:
-- 1. universities table
-- 2. applications table  
-- 3. leads table
-- And updates views to include portal_key
-- =====================================================

-- =====================================================
-- STEP 1: ALTER TABLES - Add portal_key column
-- =====================================================

-- Universities table
ALTER TABLE universities 
ADD COLUMN IF NOT EXISTS portal_key VARCHAR(50) DEFAULT 'studyatchina';

-- Applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS portal_key VARCHAR(50) DEFAULT 'studyatchina';

-- Leads table  
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS portal_key VARCHAR(50) DEFAULT 'studyatchina';

-- =====================================================
-- STEP 2: CREATE INDEXES for faster filtering
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_universities_portal_key ON universities(portal_key);
CREATE INDEX IF NOT EXISTS idx_applications_portal_key ON applications(portal_key);
CREATE INDEX IF NOT EXISTS idx_leads_portal_key ON leads(portal_key);

-- =====================================================
-- STEP 3: SET DEFAULT VALUES for existing data
-- =====================================================
UPDATE universities SET portal_key = 'studyatchina' WHERE portal_key IS NULL;
UPDATE applications SET portal_key = 'studyatchina' WHERE portal_key IS NULL;
UPDATE leads SET portal_key = 'studyatchina' WHERE portal_key IS NULL;

-- =====================================================
-- STEP 4: UPDATE VIEWS to include portal_key
-- =====================================================

-- Update v_university_programs_full view
DROP VIEW IF EXISTS v_university_programs_full;

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
    up.created_at,
    up.updated_at
FROM university_programs up
JOIN program_catalog pc ON up.program_catalog_id = pc.id
JOIN universities u ON up.university_id = u.id
LEFT JOIN languages l ON up.language_id = l.id;

-- Update v_universities_search view
DROP VIEW IF EXISTS v_universities_search;

CREATE OR REPLACE VIEW v_universities_search AS
SELECT 
    u.id,
    u.slug,
    u.name,
    u.name_local,
    u.city,
    u.province,
    u.logo_url,
    u.cover_photo_url,
    u.ranking,
    u.features,
    u.university_type,
    u.institution_category,
    u.has_fast_track,
    u.portal_key,
    COALESCE(
        (SELECT COUNT(*) FROM university_programs up WHERE up.university_id = u.id AND up.is_active = true),
        0
    ) as program_count,
    COALESCE(
        (SELECT MIN(tuition_fee) FROM university_programs up WHERE up.university_id = u.id AND up.is_active = true),
        0
    ) as min_tuition_fee
FROM universities u;

-- =====================================================
-- IMPORTANT NEXT STEPS:
-- =====================================================
-- After running this migration:
-- 1. Identify which universities belong to Spain portal
-- 2. Run: UPDATE universities SET portal_key = 'studyatspain' WHERE <condition>;
-- 3. Update applications for Spain universities:
--    UPDATE applications a 
--    SET portal_key = 'studyatspain' 
--    FROM university_programs up, universities u 
--    WHERE a.university_program_id = up.id 
--    AND up.university_id = u.id 
--    AND u.portal_key = 'studyatspain';
-- =====================================================
