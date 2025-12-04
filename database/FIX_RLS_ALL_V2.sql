-- =====================================================
-- FIX: RLS Policies for profiles AND student_documents
-- =====================================================
-- Run this script to fix "row violates row-level security policy" errors
-- This handles BOTH tables in one go.
-- =====================================================

-- 1. PROFILES TABLE
-- -----------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create fresh policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);


-- 2. STUDENT_DOCUMENTS TABLE
-- --------------------------
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Students can view their own documents" ON student_documents;
DROP POLICY IF EXISTS "Students can insert their own documents" ON student_documents;
DROP POLICY IF EXISTS "Students can update their own documents" ON student_documents;
DROP POLICY IF EXISTS "Students can delete their own documents" ON student_documents;

-- Create fresh policies
CREATE POLICY "Students can view their own documents"
    ON student_documents FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own documents"
    ON student_documents FOR INSERT
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own documents"
    ON student_documents FOR UPDATE
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can delete their own documents"
    ON student_documents FOR DELETE
    USING (auth.uid() = student_id);

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('profiles', 'student_documents')
ORDER BY tablename, policyname;
