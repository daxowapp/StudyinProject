-- =====================================================
-- DEBUG: ADMIN ACCESS AND DATA
-- =====================================================

-- 1. Check current user and role
SELECT 
    auth.uid() as current_user_id,
    p.role as profile_role,
    public.is_admin() as is_admin_function_result
FROM profiles p
WHERE p.id = auth.uid();

-- 2. Check if any documents exist (bypassing RLS for count if possible, but here we are subject to it)
-- If this returns 0, it means RLS is hiding them OR table is empty.
SELECT count(*) as visible_documents_count FROM student_documents;

-- 3. Check raw table counts (requires superuser/dashboard editor)
-- This confirms if data actually exists in the table.
SELECT count(*) as total_documents_in_table FROM student_documents;

-- 4. Check specific policies
SELECT * FROM pg_policies WHERE tablename = 'student_documents';
