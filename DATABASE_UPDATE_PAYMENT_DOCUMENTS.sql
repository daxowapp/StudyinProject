-- =====================================================
-- PAYMENT AND DOCUMENT REQUEST SYSTEM - Database Schema Updates
-- =====================================================

-- Add columns to payment_transactions table for receipt upload and card payments
ALTER TABLE payment_transactions 
ADD COLUMN IF NOT EXISTS receipt_url TEXT,
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50), -- 'receipt' or 'card'
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);

-- Add columns to document_requests table for uploaded documents
ALTER TABLE document_requests 
ADD COLUMN IF NOT EXISTS uploaded_file_url TEXT,
ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMP WITH TIME ZONE;

-- Update payment_transactions status values (if needed)
-- Possible statuses: 'pending', 'pending_verification', 'completed', 'failed', 'cancelled'

-- Update document_requests status values (if needed)
-- Possible statuses: 'pending', 'submitted', 'approved', 'rejected'

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payment_transactions_student_status 
ON payment_transactions(student_id, status);

CREATE INDEX IF NOT EXISTS idx_document_requests_application_status 
ON document_requests(application_id, status);

CREATE INDEX IF NOT EXISTS idx_document_requests_uploaded 
ON document_requests(uploaded_at) WHERE uploaded_at IS NOT NULL;

-- =====================================================
-- OPTIONAL: Add deadline columns if not already present
-- =====================================================

ALTER TABLE payment_transactions 
ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;

ALTER TABLE document_requests 
ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- Update RLS policies if needed
-- =====================================================

-- Students can view their own payment transactions
DROP POLICY IF EXISTS "Students can view own payments" ON payment_transactions;
CREATE POLICY "Students can view own payments" 
ON payment_transactions FOR SELECT 
USING (student_id = auth.uid());

-- Students can update their own payment transactions (for receipt upload)
DROP POLICY IF EXISTS "Students can update own payments" ON payment_transactions;
CREATE POLICY "Students can update own payments" 
ON payment_transactions FOR UPDATE 
USING (student_id = auth.uid());

-- Students can view document requests for their applications
DROP POLICY IF EXISTS "Students can view own document requests" ON document_requests;
CREATE POLICY "Students can view own document requests" 
ON document_requests FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM applications 
    WHERE applications.id = document_requests.application_id 
    AND applications.student_id = auth.uid()
));

-- Students can update document requests for their applications (for document upload)
DROP POLICY IF EXISTS "Students can update own document requests" ON document_requests;
CREATE POLICY "Students can update own document requests" 
ON document_requests FOR UPDATE 
USING (EXISTS (
    SELECT 1 FROM applications 
    WHERE applications.id = document_requests.application_id 
    AND applications.student_id = auth.uid()
));

-- Admins can view all payment transactions
DROP POLICY IF EXISTS "Admins can view all payments" ON payment_transactions;
CREATE POLICY "Admins can view all payments" 
ON payment_transactions FOR SELECT 
USING (true); -- In production, check for admin role

-- Admins can update all payment transactions
DROP POLICY IF EXISTS "Admins can update all payments" ON payment_transactions;
CREATE POLICY "Admins can update all payments" 
ON payment_transactions FOR UPDATE 
USING (true); -- In production, check for admin role

-- Admins can view all document requests
DROP POLICY IF EXISTS "Admins can view all document requests" ON document_requests;
CREATE POLICY "Admins can view all document requests" 
ON document_requests FOR SELECT 
USING (true); -- In production, check for admin role

-- Admins can update all document requests
DROP POLICY IF EXISTS "Admins can update all document requests" ON document_requests;
CREATE POLICY "Admins can update all document requests" 
ON document_requests FOR UPDATE 
USING (true); -- In production, check for admin role
