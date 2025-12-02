-- Enable RLS on application_documents
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean slate (optional, but good for idempotency)
DROP POLICY IF EXISTS "Users can view their own application documents" ON application_documents;
DROP POLICY IF EXISTS "Users can insert their own application documents" ON application_documents;
DROP POLICY IF EXISTS "Users can update their own application documents" ON application_documents;
DROP POLICY IF EXISTS "Admins can view all application documents" ON application_documents;

-- Policy: Users can view their own documents
CREATE POLICY "Users can view their own application documents"
ON application_documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = application_documents.application_id
    AND applications.student_id = auth.uid()
  )
);

-- Policy: Users can insert their own documents
CREATE POLICY "Users can insert their own application documents"
ON application_documents
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = application_documents.application_id
    AND applications.student_id = auth.uid()
  )
);

-- Policy: Users can update their own documents
CREATE POLICY "Users can update their own application documents"
ON application_documents
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = application_documents.application_id
    AND applications.student_id = auth.uid()
  )
);

-- Policy: Admins can view/manage all documents (assuming admin check function or role)
-- For now, we might rely on service role for admin dashboard, but if admin logs in:
-- CREATE POLICY "Admins can manage all documents" ON application_documents TO authenticated USING ( is_admin() );
-- I'll leave admin policy out for now unless requested, to avoid complexity if is_admin() doesn't exist.
-- Service role (used by my scripts) bypasses RLS.
