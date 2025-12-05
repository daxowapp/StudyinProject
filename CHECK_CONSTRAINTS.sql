-- CHECK CONSTRAINTS
-- This script checks the allowed values for the status columns

SELECT 
    conname as constraint_name, 
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c 
JOIN pg_namespace n ON n.oid = c.connamespace 
WHERE conname IN ('payment_transactions_status_check', 'document_requests_status_check');
