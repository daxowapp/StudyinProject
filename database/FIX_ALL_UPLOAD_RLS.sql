-- =====================================================
-- FIX: ALL UROPLOAD & PAYMENT RLS
-- =====================================================
-- This script fixes "row violates row-level security policy" errors
-- for:
-- 1. Document Uploads (Storage & Database)
-- 2. Payment Receipt Uploads (Storage & Database)
-- =====================================================

-- 1. FIX STORAGE RLS (documents bucket)
-- =====================================================
-- The app uses 'documents' bucket for both student docs and payment receipts
-- Paths: 'student-documents/*' and 'payment-receipts/*'

-- Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop ALL existing policies (both old and new names) to ensure clean state
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload application documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own application documents" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1ok22a_0" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1ok22a_1" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1ok22a_2" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1ok22a_3" ON storage.objects;

-- Drop the policies we are about to create
DROP POLICY IF EXISTS "Allow Authenticated Uploads to Documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Read Access to Documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow Authenticated Update to Documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow Authenticated Delete to Documents" ON storage.objects;

-- Create permissive storage policies for authenticated users
CREATE POLICY "Allow Authenticated Uploads to Documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'documents'
    -- We allow uploading to specific folders
    AND (
        (storage.foldername(name))[1] = 'payment-receipts'
        OR
        (storage.foldername(name))[1] = 'student-documents'
        OR
         -- Fallback: allow if user ID is in path (common pattern)
        (storage.foldername(name))[1] = auth.uid()::text
    )
);

CREATE POLICY "Allow Public Read Access to Documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Allow Authenticated Update to Documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Allow Authenticated Delete to Documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');


-- 2. FIX PAYMENT_TRANSACTIONS RLS
-- =====================================================
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Drop permissive or broken policies
DROP POLICY IF EXISTS "Anyone can update payment transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Students can update own payments" ON payment_transactions;
DROP POLICY IF EXISTS "Students can view own payments" ON payment_transactions;
DROP POLICY IF EXISTS "Admins can do everything on payments" ON payment_transactions;

-- Allow students to UPDATE their transactions (e.g. adding receipt_url)
CREATE POLICY "Students can update own payments"
ON payment_transactions FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = payment_transactions.application_id
        AND applications.student_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = payment_transactions.application_id
        AND applications.student_id = auth.uid()
    )
);

-- Allow students to VIEW their transactions
CREATE POLICY "Students can view own payments"
ON payment_transactions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = payment_transactions.application_id
        AND applications.student_id = auth.uid()
    )
);

-- Allow Admins full access
CREATE POLICY "Admins can do everything on payments"
ON payment_transactions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);


-- 3. FIX APPLICATION_DOCUMENTS RLS
-- =====================================================
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can insert own documents" ON application_documents;
DROP POLICY IF EXISTS "Students can view own documents" ON application_documents;
DROP POLICY IF EXISTS "Students can upate own documents" ON application_documents; -- typo coverage
DROP POLICY IF EXISTS "Students can update own documents" ON application_documents;
DROP POLICY IF EXISTS "Students can delete own documents" ON application_documents;

-- Insert logic references application_id
CREATE POLICY "Students can insert own documents"
ON application_documents FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = application_documents.application_id
        AND applications.student_id = auth.uid()
    )
);

CREATE POLICY "Students can view own documents"
ON application_documents FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = application_documents.application_id
        AND applications.student_id = auth.uid()
    )
);

CREATE POLICY "Students can update own documents"
ON application_documents FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = application_documents.application_id
        AND applications.student_id = auth.uid()
    )
);

CREATE POLICY "Students can delete own documents"
ON application_documents FOR DELETE
USING (
     EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = application_documents.application_id
        AND applications.student_id = auth.uid()
    )
);


-- 4. GRANT PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Force refreshing schema cache
NOTIFY pgrst, 'reload schema';
