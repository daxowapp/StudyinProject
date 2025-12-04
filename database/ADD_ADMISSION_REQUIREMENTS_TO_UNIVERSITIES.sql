-- =====================================================
-- ADD ADMISSION REQUIREMENTS TO ALL UNIVERSITIES
-- =====================================================
-- This script adds common admission requirements to all universities
-- =====================================================

-- Step 1: Add Bachelor-level requirements to all universities
INSERT INTO university_admission_requirements (university_id, requirement_id, is_required, display_order)
SELECT 
    u.id as university_id,
    arc.id as requirement_id,
    true as is_required,
    ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY arc.category, arc.title) as display_order
FROM universities u
CROSS JOIN admission_requirements_catalog arc
WHERE arc.requirement_type IN ('bachelor', 'all')
AND arc.is_common = true
ON CONFLICT (university_id, requirement_id) DO NOTHING;

-- Step 2: Add Master-level requirements to all universities
INSERT INTO university_admission_requirements (university_id, requirement_id, is_required, display_order)
SELECT 
    u.id as university_id,
    arc.id as requirement_id,
    true as is_required,
    ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY arc.category, arc.title) as display_order
FROM universities u
CROSS JOIN admission_requirements_catalog arc
WHERE arc.requirement_type IN ('master', 'all')
AND arc.is_common = true
ON CONFLICT (university_id, requirement_id) DO NOTHING;

-- Step 3: Add PhD-level requirements to all universities
INSERT INTO university_admission_requirements (university_id, requirement_id, is_required, display_order)
SELECT 
    u.id as university_id,
    arc.id as requirement_id,
    true as is_required,
    ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY arc.category, arc.title) as display_order
FROM universities u
CROSS JOIN admission_requirements_catalog arc
WHERE arc.requirement_type IN ('phd', 'all')
AND arc.is_common = true
ON CONFLICT (university_id, requirement_id) DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check how many requirements each university has
SELECT 
    u.name as university_name,
    COUNT(*) as total_requirements
FROM university_admission_requirements uar
JOIN universities u ON uar.university_id = u.id
GROUP BY u.name
ORDER BY total_requirements DESC;

-- View requirements for a specific university (replace name as needed)
SELECT 
    arc.category,
    arc.requirement_type,
    arc.title,
    arc.description,
    uar.is_required,
    uar.custom_note
FROM university_admission_requirements uar
JOIN admission_requirements_catalog arc ON uar.requirement_id = arc.id
JOIN universities u ON uar.university_id = u.id
WHERE u.name ILIKE '%Tsinghua%'  -- Change university name here
ORDER BY arc.category, uar.display_order;

-- =====================================================
-- ALTERNATIVE: Add requirements to a SINGLE university
-- =====================================================
-- Uncomment and modify the university name to add requirements to just one university

/*
INSERT INTO university_admission_requirements (university_id, requirement_id, is_required, display_order)
SELECT 
    u.id as university_id,
    arc.id as requirement_id,
    true as is_required,
    ROW_NUMBER() OVER (ORDER BY arc.category, arc.title) as display_order
FROM universities u
CROSS JOIN admission_requirements_catalog arc
WHERE u.name = 'Tsinghua University'  -- Change this to your university name
AND arc.requirement_type IN ('bachelor', 'master', 'phd', 'all')
AND arc.is_common = true
ON CONFLICT (university_id, requirement_id) DO NOTHING;
*/

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. This script adds ALL common requirements to ALL universities
-- 2. Uses ON CONFLICT DO NOTHING to avoid duplicates
-- 3. Requirements are automatically ordered by category
-- 4. You can customize per university later through the admin interface
-- =====================================================
