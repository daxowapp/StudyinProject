-- =====================================================
-- FIX: STUDENT DOCUMENTS FOREIGN KEY
-- =====================================================
-- The current FK references auth.users, which prevents
-- PostgREST from automatically detecting the relationship
-- with public.profiles. We need to reference profiles directly.
-- =====================================================

-- 1. Drop existing constraint (name might vary, so we try standard names)
ALTER TABLE student_documents
DROP CONSTRAINT IF EXISTS student_documents_student_id_fkey;

-- 2. Add new constraint referencing profiles
ALTER TABLE student_documents
ADD CONSTRAINT student_documents_student_id_fkey
FOREIGN KEY (student_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- 3. Verify the relationship
SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'student_documents';
