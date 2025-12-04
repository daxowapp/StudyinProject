-- =====================================================
-- MASTER FIX: CLEAN AND REBUILD ALL RLS POLICIES
-- =====================================================
-- This script removes ALL duplicate/conflicting policies
-- and creates a clean, verified set for all tables.
-- =====================================================

-- 1. PROFILES TABLE
-- -----------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop ALL potential duplicate policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create CLEAN policies
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

-- Drop ALL potential duplicate policies
DROP POLICY IF EXISTS "Students can delete their own documents" ON student_documents;
DROP POLICY IF EXISTS "Students can insert their own documents" ON student_documents;
DROP POLICY IF EXISTS "Students can update their own documents" ON student_documents;
DROP POLICY IF EXISTS "Students can view their own documents" ON student_documents;

-- Create CLEAN policies
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


-- 3. APPLICATIONS TABLE
-- ---------------------
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Drop ALL potential duplicate policies
DROP POLICY IF EXISTS "Admins can manage all applications" ON applications;
DROP POLICY IF EXISTS "Students can create own applications" ON applications;
DROP POLICY IF EXISTS "Students can insert their own applications" ON applications;
DROP POLICY IF EXISTS "Students can update own draft applications" ON applications;
DROP POLICY IF EXISTS "Students can update their own applications" ON applications;
DROP POLICY IF EXISTS "Students can view own applications" ON applications;
DROP POLICY IF EXISTS "Students can view their own applications" ON applications;

-- Create CLEAN policies
CREATE POLICY "Students can view their own applications"
    ON applications FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own applications"
    ON applications FOR INSERT
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own applications"
    ON applications FOR UPDATE
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);


-- 4. APPLICATION_DOCUMENTS TABLE
-- ------------------------------
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;

-- Drop ALL potential duplicate policies
DROP POLICY IF EXISTS "Admins can manage all documents" ON application_documents;
DROP POLICY IF EXISTS "Students can delete own unverified documents" ON application_documents;
DROP POLICY IF EXISTS "Students can insert their own application documents" ON application_documents;
DROP POLICY IF EXISTS "Students can upload own documents" ON application_documents;
DROP POLICY IF EXISTS "Students can view own documents" ON application_documents;
DROP POLICY IF EXISTS "Students can view their own application documents" ON application_documents;
DROP POLICY IF EXISTS "Users can insert their own application documents" ON application_documents;
DROP POLICY IF EXISTS "Users can update their own application documents" ON application_documents;
DROP POLICY IF EXISTS "Users can view their own application documents" ON application_documents;

-- Create CLEAN policies
-- Note: We use a simplified check for INSERT to avoid complex joins if possible,
-- but since we don't have student_id, we MUST check via application_id.
-- We ensure the user can SELECT the application first.

CREATE POLICY "Students can view their own application documents"
    ON application_documents FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM applications
            WHERE applications.id = application_documents.application_id
            AND applications.student_id = auth.uid()
        )
    );

CREATE POLICY "Students can insert their own application documents"
    ON application_documents FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM applications
            WHERE applications.id = application_documents.application_id
            AND applications.student_id = auth.uid()
        )
    );

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('profiles', 'student_documents', 'applications', 'application_documents')
ORDER BY tablename, policyname;
