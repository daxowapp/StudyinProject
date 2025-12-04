-- =====================================================
-- DEBUG: CHECK TRIGGERS
-- =====================================================
-- Run this to see if any triggers are causing the RLS error
-- =====================================================

SELECT 
    event_object_table as table_name,
    trigger_name,
    event_manipulation as event,
    action_statement as definition
FROM information_schema.triggers
WHERE event_object_table IN ('profiles', 'student_documents', 'applications', 'application_documents')
ORDER BY event_object_table, trigger_name;
