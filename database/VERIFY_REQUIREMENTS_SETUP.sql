-- =====================================================
-- VERIFY ADMISSION REQUIREMENTS SETUP
-- =====================================================
-- Run this to check everything is working correctly
-- =====================================================

-- 1. Check the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'admission_requirements_catalog'
ORDER BY ordinal_position;

-- 2. Count requirements by category and type
SELECT 
    category,
    requirement_type,
    COUNT(*) as count
FROM admission_requirements_catalog
GROUP BY category, requirement_type
ORDER BY category, requirement_type;

-- 3. Check for any duplicate titles
SELECT title, COUNT(*) as count
FROM admission_requirements_catalog
GROUP BY title
HAVING COUNT(*) > 1;

-- 4. Verify all language requirements are "all" level
SELECT title, requirement_type
FROM admission_requirements_catalog
WHERE category = 'language'
ORDER BY title;

-- 5. Check which requirements are assigned to universities
SELECT 
    arc.title,
    arc.category,
    arc.requirement_type,
    COUNT(DISTINCT uar.university_id) as universities_using
FROM admission_requirements_catalog arc
LEFT JOIN university_admission_requirements uar ON uar.requirement_id = arc.id
GROUP BY arc.id, arc.title, arc.category, arc.requirement_type
ORDER BY universities_using DESC, arc.category, arc.title;

-- 6. Verify the view exists and works
SELECT COUNT(*) as total_requirements_in_view
FROM v_university_admission_requirements;

-- 7. Check if there are any requirements without proper data
SELECT *
FROM admission_requirements_catalog
WHERE title IS NULL 
   OR title = '' 
   OR category IS NULL 
   OR requirement_type IS NULL
   OR description IS NULL;
