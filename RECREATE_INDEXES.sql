-- =====================================================
-- RECREATE INDEXES (Safe to run multiple times)
-- =====================================================
-- This script drops existing indexes and recreates them
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop all existing indexes
DROP INDEX IF EXISTS idx_messages_application;
DROP INDEX IF EXISTS idx_messages_sender;
DROP INDEX IF EXISTS idx_messages_unread;
DROP INDEX IF EXISTS idx_messages_requires_action;
DROP INDEX IF EXISTS idx_payments_application;
DROP INDEX IF EXISTS idx_payments_student;
DROP INDEX IF EXISTS idx_payments_status;
DROP INDEX IF EXISTS idx_payments_pending;
DROP INDEX IF EXISTS idx_emails_recipient;
DROP INDEX IF EXISTS idx_emails_application;
DROP INDEX IF EXISTS idx_emails_status;
DROP INDEX IF EXISTS idx_emails_type;
DROP INDEX IF EXISTS idx_doc_requests_application;
DROP INDEX IF EXISTS idx_doc_requests_status;
DROP INDEX IF EXISTS idx_doc_requests_pending;
DROP INDEX IF EXISTS idx_interviews_application;
DROP INDEX IF EXISTS idx_interviews_status;
DROP INDEX IF EXISTS idx_interviews_date;

-- =====================================================
-- CREATE INDEXES
-- =====================================================

-- Indexes for application_messages
CREATE INDEX idx_messages_application ON application_messages(application_id);
CREATE INDEX idx_messages_sender ON application_messages(sender_id);
CREATE INDEX idx_messages_unread ON application_messages(is_read) WHERE is_read = false;
CREATE INDEX idx_messages_requires_action ON application_messages(requires_action) WHERE requires_action = true;

-- Indexes for payment_transactions
CREATE INDEX idx_payments_application ON payment_transactions(application_id);
CREATE INDEX idx_payments_student ON payment_transactions(student_id);
CREATE INDEX idx_payments_status ON payment_transactions(status);
CREATE INDEX idx_payments_pending ON payment_transactions(status) WHERE status = 'pending';

-- Indexes for email_notifications
CREATE INDEX idx_emails_recipient ON email_notifications(recipient_id);
CREATE INDEX idx_emails_application ON email_notifications(application_id);
CREATE INDEX idx_emails_status ON email_notifications(status);
CREATE INDEX idx_emails_type ON email_notifications(email_type);

-- Indexes for document_requests
CREATE INDEX idx_doc_requests_application ON document_requests(application_id);
CREATE INDEX idx_doc_requests_status ON document_requests(status);
CREATE INDEX idx_doc_requests_pending ON document_requests(status) WHERE status = 'pending';

-- Indexes for interview_schedules
CREATE INDEX idx_interviews_application ON interview_schedules(application_id);
CREATE INDEX idx_interviews_status ON interview_schedules(status);
CREATE INDEX idx_interviews_date ON interview_schedules(scheduled_date);

-- =====================================================
-- VERIFY INDEXES
-- =====================================================

SELECT 
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE tablename IN (
    'application_messages',
    'payment_transactions',
    'email_notifications',
    'document_requests',
    'interview_schedules'
)
ORDER BY tablename, indexname;

-- =====================================================
-- Expected Result: 18 indexes created
-- =====================================================
