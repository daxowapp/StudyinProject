-- =====================================================
-- DEBUG: Check Requirements for XJTLU Program
-- =====================================================
-- Run these queries to debug why requirements aren't showing
-- =====================================================

-- 1. Find the university ID for XJTLU
SELECT id, name, slug 
FROM universities 
WHERE name ILIKE '%xjtlu%' OR slug ILIKE '%xjtlu%';

-- 2. Find the program
SELECT id, slug, university_id, program_catalog_id
FROM university_programs
WHERE slug = 'xjtlu-construction-management-2026-master';

-- 3. Check if requirements exist for this university
SELECT 
    u.name as university_name,
    COUNT(uar.*) as requirement_count
FROM universities u
LEFT JOIN university_admission_requirements uar ON uar.university_id = u.id
WHERE u.name ILIKE '%xjtlu%'
GROUP BY u.id, u.name;

-- 4. Show the actual requirements
SELECT 
    u.name as university,
    arc.title,
    arc.category,
    arc.requirement_type,
    uar.is_required,
    uar.custom_note
FROM universities u
JOIN university_admission_requirements uar ON uar.university_id = u.id
JOIN admission_requirements_catalog arc ON arc.id = uar.requirement_id
WHERE u.name ILIKE '%xjtlu%'
ORDER BY arc.category, arc.title;

-- 5. Check the view structure
SELECT * FROM v_university_admission_requirements LIMIT 1;

-- 6. Test the exact query from the code
SELECT *
FROM v_university_admission_requirements
WHERE university_id = (SELECT id FROM universities WHERE name ILIKE '%xjtlu%' LIMIT 1)
AND requirement_type IN ('master', 'all');
