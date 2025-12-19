-- =====================================================
-- FIX STATUS CONSTRAINTS SCRIPT
-- =====================================================

-- 1. FIX PAYMENT TRANSACTIONS CONSTRAINT
-- We need to ensure 'pending_verification' and 'rejected' are allowed.

ALTER TABLE payment_transactions 
DROP CONSTRAINT IF EXISTS payment_transactions_status_check;

ALTER TABLE payment_transactions 
ADD CONSTRAINT payment_transactions_status_check 
CHECK (status IN (
    'pending', 
    'processing', 
    'completed', 
    'failed', 
    'refunded', 
    'cancelled', 
    'pending_verification', 
    'rejected'
));

-- 2. FIX DOCUMENT REQUESTS CONSTRAINT
-- We need to ensure 'submitted', 'approved', and 'rejected' are allowed.

ALTER TABLE document_requests 
DROP CONSTRAINT IF EXISTS document_requests_status_check;

ALTER TABLE document_requests 
ADD CONSTRAINT document_requests_status_check 
CHECK (status IN (
    'pending', 
    'uploaded', 
    'verified', 
    'rejected', 
    'submitted', 
    'approved'
));

DO $$
BEGIN
    RAISE NOTICE '✅ Status constraints updated successfully!';
END $$;
