-- =====================================================
-- ADD REQUIREMENTS TO XJTLU UNIVERSITY
-- =====================================================

-- Step 1: Find XJTLU university ID
SELECT id, name FROM universities WHERE name ILIKE '%xjtlu%' OR name ILIKE '%xi%jiaotong%';

-- Step 2: Check current requirements for XJTLU
SELECT COUNT(*) as requirement_count
FROM university_admission_requirements uar
JOIN universities u ON u.id = uar.university_id
WHERE u.name ILIKE '%xjtlu%';

-- Step 3: Add ALL common requirements to XJTLU (all levels)
INSERT INTO university_admission_requirements (university_id, requirement_id, is_required, display_order)
SELECT 
    (SELECT id FROM universities WHERE name ILIKE '%xjtlu%' LIMIT 1) as university_id,
    arc.id as requirement_id,
    true as is_required,
    ROW_NUMBER() OVER (ORDER BY arc.category, arc.title) as display_order
FROM admission_requirements_catalog arc
WHERE arc.is_common = true
AND arc.requirement_type IN ('all', 'master')  -- For master programs
ON CONFLICT (university_id, requirement_id) DO NOTHING;

-- Step 4: Verify requirements were added
SELECT 
    u.name as university,
    arc.category,
    arc.title,
    arc.requirement_type
FROM university_admission_requirements uar
JOIN universities u ON u.id = uar.university_id
JOIN admission_requirements_catalog arc ON arc.id = uar.requirement_id
WHERE u.name ILIKE '%xjtlu%'
ORDER BY arc.category, arc.title;
