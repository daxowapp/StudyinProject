-- =====================================================
-- FIX: RLS Policies for ALL Application Tables
-- =====================================================
-- The error "new row violates row-level security policy" likely comes
-- from 'applications' or 'application_documents' tables which we missed.
-- =====================================================

-- 1. APPLICATIONS TABLE
-- ---------------------
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own applications" ON applications;
DROP POLICY IF EXISTS "Students can insert their own applications" ON applications;
DROP POLICY IF EXISTS "Students can update their own applications" ON applications;

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


-- 2. APPLICATION_DOCUMENTS TABLE
-- ------------------------------
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own application documents" ON application_documents;
DROP POLICY IF EXISTS "Students can insert their own application documents" ON application_documents;

-- This one is tricky because application_documents doesn't usually have student_id directly.
-- It links to application_id.
-- We need to check if the related application belongs to the user.

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
WHERE tablename IN ('applications', 'application_documents')
ORDER BY tablename;
