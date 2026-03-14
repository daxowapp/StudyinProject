-- Fix: The notifications table column is "userId" (camelCase),
-- but the trigger was using "user_id" (snake_case).
-- Also: the "id" column has no default, so we must provide gen_random_uuid().

CREATE OR REPLACE FUNCTION notify_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO notifications (id, "userId", title, message, type, link, created_at)
        VALUES (
            gen_random_uuid(),
            NEW.student_id,
            'Application Status Updated',
            'Your application status has changed to ' || NEW.status,
            'status_change',
            '/dashboard/applications/' || NEW.id,
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
