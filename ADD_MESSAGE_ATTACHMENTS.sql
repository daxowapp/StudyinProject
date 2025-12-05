-- =====================================================
-- ADD MESSAGE ATTACHMENTS SUPPORT
-- =====================================================
-- This adds file attachment support to messages
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create message_attachments table
CREATE TABLE IF NOT EXISTS message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES application_messages(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER, -- in bytes
    file_type VARCHAR(100), -- pdf, jpg, png, docx, etc.
    mime_type VARCHAR(100),
    uploaded_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_attachments_message ON message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_attachments_uploader ON message_attachments(uploaded_by);

-- Enable RLS
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attachments
-- Students can view attachments for their messages
CREATE POLICY "Students can view their message attachments"
    ON message_attachments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM application_messages m
            JOIN applications a ON a.id = m.application_id
            WHERE m.id = message_attachments.message_id
            AND a.student_id = auth.uid()
        )
    );

-- Students can upload attachments to their messages
CREATE POLICY "Students can upload attachments"
    ON message_attachments FOR INSERT
    WITH CHECK (
        uploaded_by = auth.uid()
        AND EXISTS (
            SELECT 1 FROM application_messages m
            JOIN applications a ON a.id = m.application_id
            WHERE m.id = message_id
            AND a.student_id = auth.uid()
        )
    );

-- Admins can view all attachments
CREATE POLICY "Admins can view all attachments"
    ON message_attachments FOR SELECT
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- Admins can upload attachments
CREATE POLICY "Admins can upload attachments"
    ON message_attachments FOR INSERT
    WITH CHECK (
        uploaded_by = auth.uid()
        AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- Admins can delete attachments
CREATE POLICY "Admins can delete attachments"
    ON message_attachments FOR DELETE
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- =====================================================
-- VERIFICATION
-- =====================================================

SELECT 'Message Attachments Table:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'message_attachments';

SELECT 'Attachment Policies:' as info;
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'message_attachments' 
ORDER BY policyname;

SELECT '✅ Message attachments support added!' as status;
