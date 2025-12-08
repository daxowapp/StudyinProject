-- =====================================================
-- FIX: DOCUMENT UPLOAD ROW LEVEL SECURITY (RLS)
-- =====================================================
-- This script fixes the "new row violates row-level security policy"
-- error for both database tables and storage.
-- =====================================================

-- 1. FIX APPLICATION_DOCUMENTS RLS
-- =====================================================
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can upload own documents" ON application_documents;
DROP POLICY IF EXISTS "Students can insert own documents" ON application_documents;
DROP POLICY IF EXISTS "Users can insert their own application documents" ON application_documents;

-- Re-create the INSERT policy with a clear definition
CREATE POLICY "Students can insert own documents" 
    ON application_documents FOR INSERT 
    WITH CHECK (
        -- Allow if the application belongs to the student
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = application_documents.application_id 
            AND applications.student_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Students can view own documents" ON application_documents;
CREATE POLICY "Students can view own documents" 
    ON application_documents FOR SELECT 
    USING (
        -- Allow if the application belongs to the student
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = application_documents.application_id 
            AND applications.student_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Students can update own documents" ON application_documents;
CREATE POLICY "Students can update own documents" 
    ON application_documents FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = application_documents.application_id 
            AND applications.student_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Students can delete own documents" ON application_documents;
CREATE POLICY "Students can delete own documents" 
    ON application_documents FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = application_documents.application_id 
            AND applications.student_id = auth.uid()
        )
    );


-- 2. FIX STUDENT_DOCUMENTS RLS (If used)
-- =====================================================
-- Check if table exists to avoid errors
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'student_documents') THEN
        
        ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;

        -- Drop old policies to be safe
        DROP POLICY IF EXISTS "Students can insert their own documents" ON student_documents;
        DROP POLICY IF EXISTS "Students can view their own documents" ON student_documents;
        DROP POLICY IF EXISTS "Students can update their own documents" ON student_documents;
        DROP POLICY IF EXISTS "Students can delete their own documents" ON student_documents;

        -- Create new permissive policies
        CREATE POLICY "Students can insert their own documents"
            ON student_documents FOR INSERT
            WITH CHECK (auth.uid() = student_id);

        CREATE POLICY "Students can view their own documents"
            ON student_documents FOR SELECT
            USING (auth.uid() = student_id);

        CREATE POLICY "Students can update their own documents"
            ON student_documents FOR UPDATE
            USING (auth.uid() = student_id);

        CREATE POLICY "Students can delete their own documents"
            ON student_documents FOR DELETE
            USING (auth.uid() = student_id);
            
    END IF;
END $$;


-- 3. FIX STORAGE RLS (storage.objects)
-- =====================================================
-- Fix for "application-documents" bucket
-- We allow users to upload ANY file to this bucket if they are authenticated
-- and the folder name starts with their user ID (standard pattern)

DROP POLICY IF EXISTS "Users can upload application documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own application documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own application documents" ON storage.objects;

CREATE POLICY "Users can upload application documents"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'application-documents' AND 
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own application documents"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'application-documents' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own application documents"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'application-documents' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. GRANT PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
