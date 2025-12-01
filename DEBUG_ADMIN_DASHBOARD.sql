-- Debug Admin Dashboard Query
SELECT 
    a.id,
    a.student_name,
    a.status,
    a.created_at,
    p.title as program_title,
    u.name as university_name
FROM applications a
LEFT JOIN programs p ON a.university_program_id = p.id
LEFT JOIN universities u ON p.university_id = u.id
ORDER BY a.created_at DESC
LIMIT 5;

-- Check total count
SELECT count(*) FROM applications;

-- Check RLS on related tables
SELECT * FROM pg_policies WHERE tablename IN ('programs', 'universities');
