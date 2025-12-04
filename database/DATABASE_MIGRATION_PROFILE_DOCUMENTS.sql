-- =====================================================
-- PROFILE AUTO-FILL & DOCUMENT MANAGEMENT MIGRATION
-- =====================================================
-- This migration adds profile fields and creates student_documents table
-- for reusable documents across applications
-- =====================================================

-- 1. Update profiles table with student information fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS phone_country_code TEXT DEFAULT '+86',
ADD COLUMN IF NOT EXISTS nationality TEXT,
ADD COLUMN IF NOT EXISTS passport_number TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS emergency_phone_code TEXT DEFAULT '+86',
ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT,
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
ADD COLUMN IF NOT EXISTS profile_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create student_documents table for reusable documents
CREATE TABLE IF NOT EXISTS student_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'passport', 'transcript', 'diploma', 'photo', etc.
    document_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT, -- MIME type
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    notes TEXT,
    CONSTRAINT unique_student_document UNIQUE(student_id, document_type)
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_documents_student ON student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_type ON student_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_student_documents_verified ON student_documents(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at);

-- 4. Create function to update profiles.updated_at automatically
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger for profiles.updated_at
DROP TRIGGER IF EXISTS trigger_update_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profiles_updated_at();

-- 6. Add comments for documentation
COMMENT ON TABLE student_documents IS 'Stores reusable student documents that can be linked to multiple applications';
COMMENT ON COLUMN student_documents.document_type IS 'Type of document (passport, transcript, diploma, etc.) - used as unique key per student';
COMMENT ON COLUMN student_documents.is_verified IS 'Whether the document has been verified by admin';

-- 7. Grant necessary permissions (adjust based on your RLS policies)
-- ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (uncomment and adjust as needed):
-- CREATE POLICY "Students can view their own documents"
--     ON student_documents FOR SELECT
--     USING (auth.uid() = student_id);

-- CREATE POLICY "Students can insert their own documents"
--     ON student_documents FOR INSERT
--     WITH CHECK (auth.uid() = student_id);

-- CREATE POLICY "Students can update their own documents"
--     ON student_documents FOR UPDATE
--     USING (auth.uid() = student_id);

-- CREATE POLICY "Students can delete their own documents"
--     ON student_documents FOR DELETE
--     USING (auth.uid() = student_id);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check student_documents table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'student_documents'
ORDER BY ordinal_position;

-- Verify indexes were created
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename IN ('profiles', 'student_documents')
ORDER BY tablename, indexname;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Update ApplyForm to save data to profile
-- 2. Update ApplyForm to save documents to student_documents
-- 3. Create profile edit page
-- 4. Create documents management page
-- =====================================================
