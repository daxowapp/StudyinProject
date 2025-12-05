-- =====================================================
-- DEBUG AND FIX SCRIPT
-- =====================================================

-- 1. CHECK IF DATA EXISTS
-- This will tell us if the requests were actually created in the database
SELECT 'Application Check' as check_type, id, student_id, status 
FROM applications 
WHERE id = '4a23971c-9584-46ff-8d01-183c9a57bc87';

SELECT 'Payment Requests Count' as check_type, count(*) as count, string_agg(status, ', ') as statuses
FROM payment_transactions 
WHERE application_id = '4a23971c-9584-46ff-8d01-183c9a57bc87';

SELECT 'Document Requests Count' as check_type, count(*) as count, string_agg(document_name, ', ') as docs
FROM document_requests 
WHERE application_id = '4a23971c-9584-46ff-8d01-183c9a57bc87';

-- 2. FIX RLS POLICIES (TEMPORARY DEBUGGING)
-- If the counts above are > 0 but you see "0" in the dashboard, this will fix it.
-- It allows ANY authenticated user to view the requests (we will restrict this later).

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view payment transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Students can view their own payment transactions" ON payment_transactions;
DROP POLICY IF EXISTS "view_policy_payment" ON payment_transactions;

DROP POLICY IF EXISTS "Anyone can view document requests" ON document_requests;
DROP POLICY IF EXISTS "Students can view their own document requests" ON document_requests;
DROP POLICY IF EXISTS "view_policy_documents" ON document_requests;

-- Create permissive policies for debugging
CREATE POLICY "debug_view_payments" 
ON payment_transactions FOR SELECT 
USING (true);

CREATE POLICY "debug_view_documents" 
ON document_requests FOR SELECT 
USING (true);

-- 3. VERIFY COLUMNS
-- Just to be 100% sure the columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'payment_transactions' AND column_name IN ('student_id', 'payment_type', 'description');
