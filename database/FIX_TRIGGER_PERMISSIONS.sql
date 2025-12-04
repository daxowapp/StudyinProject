-- =====================================================
-- FIX: TRIGGER PERMISSIONS & LOG TABLES
-- =====================================================
-- The error is likely caused by triggers trying to write to
-- tables that the student doesn't have permission to access.
-- =====================================================

-- 1. FIX APPLICATION LOGS TABLE
-- -----------------------------
-- Create the table if it doesn't exist (it might be missing)
CREATE TABLE IF NOT EXISTS application_status_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT,
    changed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE application_status_logs ENABLE ROW LEVEL SECURITY;

-- Allow students to insert logs (via trigger)
CREATE POLICY "Users can insert logs"
    ON application_status_logs FOR INSERT
    WITH CHECK (true);

-- Allow students to view their own logs
CREATE POLICY "Users can view own logs"
    ON application_status_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM applications
            WHERE applications.id = application_status_logs.application_id
            AND applications.student_id = auth.uid()
        )
    );

-- 2. FIX NOTIFICATIONS TABLE
-- --------------------------
-- Create table if missing
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow system to insert notifications (via trigger)
-- Since triggers run as the user, we need to allow INSERT
CREATE POLICY "Users can insert notifications"
    ON notifications FOR INSERT
    WITH CHECK (true);

-- Allow users to view/update their own notifications
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- 3. SECURITY DEFINER FUNCTIONS
-- -----------------------------
-- Make the trigger functions run with elevated privileges (SECURITY DEFINER)
-- This bypasses RLS checks for the trigger logic itself.

CREATE OR REPLACE FUNCTION log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO application_status_logs (application_id, old_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- <--- CRITICAL CHANGE

CREATE OR REPLACE FUNCTION notify_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        -- Notify the student
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (
            NEW.student_id,
            'Application Status Updated',
            'Your application status has changed to ' || NEW.status,
            'status_change',
            '/dashboard/applications/' || NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- <--- CRITICAL CHANGE

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT proname, prosecdef 
FROM pg_proc 
WHERE proname IN ('log_application_status_change', 'notify_on_status_change');
