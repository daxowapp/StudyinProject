-- =====================================================
-- COMMUNICATION & PAYMENT MANAGEMENT SYSTEM
-- =====================================================

-- 1. APPLICATION MESSAGES TABLE
-- For communication between admin and students
CREATE TABLE IF NOT EXISTS application_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL, -- References auth.users(id)
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('admin', 'student')),
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN (
        'general',
        'document_request',
        'payment_request',
        'status_update',
        'acceptance_letter',
        'rejection_notice',
        'interview_invitation',
        'additional_info_request'
    )),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    requires_action BOOLEAN DEFAULT false,
    action_type VARCHAR(50), -- 'upload_document', 'make_payment', 'respond', etc.
    action_deadline TIMESTAMP WITH TIME ZONE,
    action_completed BOOLEAN DEFAULT false,
    action_completed_at TIMESTAMP WITH TIME ZONE,
    attachments JSONB, -- Array of file URLs
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX idx_messages_application ON application_messages(application_id);
CREATE INDEX idx_messages_sender ON application_messages(sender_id);
CREATE INDEX idx_messages_unread ON application_messages(is_read) WHERE is_read = false;
CREATE INDEX idx_messages_requires_action ON application_messages(requires_action) WHERE requires_action = true;

-- 2. PAYMENT TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    student_id UUID NOT NULL, -- References auth.users(id)
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN (
        'application_fee',
        'service_fee',
        'tuition_deposit',
        'full_tuition',
        'accommodation',
        'other'
    )),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'RMB',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending',
        'processing',
        'completed',
        'failed',
        'refunded',
        'cancelled'
    )),
    payment_method VARCHAR(50), -- 'bank_transfer', 'credit_card', 'alipay', 'wechat', etc.
    payment_gateway VARCHAR(50), -- 'stripe', 'paypal', 'alipay', etc.
    transaction_id VARCHAR(255), -- External payment gateway transaction ID
    payment_reference VARCHAR(255), -- Internal reference number
    payment_link TEXT, -- Unique payment link for this transaction
    payment_link_expires_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_proof_url TEXT, -- URL to uploaded payment proof
    admin_verified BOOLEAN DEFAULT false,
    verified_by UUID, -- Admin who verified
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    refund_amount DECIMAL(10, 2),
    refund_reason TEXT,
    refunded_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB, -- Additional payment data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for payments
CREATE INDEX idx_payments_application ON payment_transactions(application_id);
CREATE INDEX idx_payments_student ON payment_transactions(student_id);
CREATE INDEX idx_payments_status ON payment_transactions(status);
CREATE INDEX idx_payments_pending ON payment_transactions(status) WHERE status = 'pending';

-- 3. EMAIL NOTIFICATIONS TABLE
-- Track all emails sent to students
CREATE TABLE IF NOT EXISTS email_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL, -- References auth.users(id)
    recipient_email VARCHAR(255) NOT NULL,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    message_id UUID REFERENCES application_messages(id) ON DELETE SET NULL,
    payment_id UUID REFERENCES payment_transactions(id) ON DELETE SET NULL,
    email_type VARCHAR(50) NOT NULL CHECK (email_type IN (
        'application_submitted',
        'application_received',
        'status_changed',
        'document_requested',
        'payment_requested',
        'payment_received',
        'acceptance_letter',
        'rejection_notice',
        'interview_invitation',
        'message_received',
        'deadline_reminder',
        'welcome',
        'password_reset'
    )),
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    html_body TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending',
        'sent',
        'delivered',
        'failed',
        'bounced'
    )),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for email notifications
CREATE INDEX idx_emails_recipient ON email_notifications(recipient_id);
CREATE INDEX idx_emails_application ON email_notifications(application_id);
CREATE INDEX idx_emails_status ON email_notifications(status);
CREATE INDEX idx_emails_type ON email_notifications(email_type);

-- 4. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE, -- References auth.users(id)
    email_application_updates BOOLEAN DEFAULT true,
    email_messages BOOLEAN DEFAULT true,
    email_payment_requests BOOLEAN DEFAULT true,
    email_document_requests BOOLEAN DEFAULT true,
    email_status_changes BOOLEAN DEFAULT true,
    email_deadlines BOOLEAN DEFAULT true,
    email_marketing BOOLEAN DEFAULT false,
    sms_enabled BOOLEAN DEFAULT false,
    sms_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. DOCUMENT REQUESTS TABLE
-- Track specific document requests from admin
CREATE TABLE IF NOT EXISTS document_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    message_id UUID REFERENCES application_messages(id) ON DELETE SET NULL,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT true,
    deadline TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending',
        'uploaded',
        'verified',
        'rejected'
    )),
    uploaded_document_id UUID REFERENCES application_documents(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    requested_by UUID, -- Admin who requested
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for document requests
CREATE INDEX idx_doc_requests_application ON document_requests(application_id);
CREATE INDEX idx_doc_requests_status ON document_requests(status);
CREATE INDEX idx_doc_requests_pending ON document_requests(status) WHERE status = 'pending';

-- 6. ACCEPTANCE LETTERS TABLE
CREATE TABLE IF NOT EXISTS acceptance_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    letter_number VARCHAR(100) UNIQUE NOT NULL, -- Official letter number
    issue_date DATE NOT NULL,
    valid_until DATE,
    letter_pdf_url TEXT, -- URL to generated PDF
    jw202_form_url TEXT, -- URL to JW202 form (for international students)
    visa_letter_url TEXT, -- URL to visa invitation letter
    issued_by UUID, -- Admin who issued
    notes TEXT,
    sent_to_student BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    student_confirmed BOOLEAN DEFAULT false,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. INTERVIEW SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS interview_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    interview_type VARCHAR(50) CHECK (interview_type IN ('online', 'in_person', 'phone')),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    location TEXT, -- Physical address or online meeting link
    meeting_link TEXT,
    meeting_password VARCHAR(100),
    interviewer_name VARCHAR(255),
    interviewer_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN (
        'scheduled',
        'confirmed',
        'rescheduled',
        'completed',
        'cancelled',
        'no_show'
    )),
    student_confirmed BOOLEAN DEFAULT false,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    interview_notes TEXT, -- Notes from the interview
    result VARCHAR(50), -- 'passed', 'failed', 'pending'
    created_by UUID, -- Admin who created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for interviews
CREATE INDEX idx_interviews_application ON interview_schedules(application_id);
CREATE INDEX idx_interviews_status ON interview_schedules(status);
CREATE INDEX idx_interviews_date ON interview_schedules(scheduled_date);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON application_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_prefs_updated_at BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doc_requests_updated_at BEFORE UPDATE ON document_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_acceptance_letters_updated_at BEFORE UPDATE ON acceptance_letters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interview_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to send email notification when message is created
CREATE OR REPLACE FUNCTION notify_on_new_message()
RETURNS TRIGGER AS $$
DECLARE
    student_email VARCHAR(255);
    student_id UUID;
BEGIN
    -- Get student email from application
    SELECT a.student_email, a.student_id INTO student_email, student_id
    FROM applications a
    WHERE a.id = NEW.application_id;

    -- Create email notification record
    INSERT INTO email_notifications (
        recipient_id,
        recipient_email,
        application_id,
        message_id,
        email_type,
        subject,
        body,
        status
    ) VALUES (
        student_id,
        student_email,
        NEW.application_id,
        NEW.id,
        'message_received',
        NEW.subject,
        NEW.message,
        'pending'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_on_new_message
    AFTER INSERT ON application_messages
    FOR EACH ROW
    WHEN (NEW.sender_type = 'admin')
    EXECUTE FUNCTION notify_on_new_message();

-- Function to send email when payment is requested
CREATE OR REPLACE FUNCTION notify_on_payment_request()
RETURNS TRIGGER AS $$
DECLARE
    student_email VARCHAR(255);
    app_id UUID;
BEGIN
    -- Get student email and application id
    SELECT a.student_email, a.id INTO student_email, app_id
    FROM applications a
    WHERE a.student_id = NEW.student_id
    AND a.id = NEW.application_id;

    -- Create email notification
    INSERT INTO email_notifications (
        recipient_id,
        recipient_email,
        application_id,
        payment_id,
        email_type,
        subject,
        body,
        status
    ) VALUES (
        NEW.student_id,
        student_email,
        app_id,
        NEW.id,
        'payment_requested',
        'Payment Required for Your Application',
        'A payment of ' || NEW.amount || ' ' || NEW.currency || ' is required. Please use the payment link to complete the transaction.',
        'pending'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_on_payment_request
    AFTER INSERT ON payment_transactions
    FOR EACH ROW
    WHEN (NEW.status = 'pending')
    EXECUTE FUNCTION notify_on_payment_request();

-- Function to send email when application status changes
CREATE OR REPLACE FUNCTION notify_on_status_change()
RETURNS TRIGGER AS $$
DECLARE
    student_email VARCHAR(255);
    student_id UUID;
    status_text TEXT;
BEGIN
    IF NEW.status != OLD.status THEN
        -- Get student info
        SELECT a.student_email, a.student_id INTO student_email, student_id
        FROM applications a
        WHERE a.id = NEW.id;

        -- Format status text
        status_text := REPLACE(INITCAP(REPLACE(NEW.status, '_', ' ')), '_', ' ');

        -- Create email notification
        INSERT INTO email_notifications (
            recipient_id,
            recipient_email,
            application_id,
            email_type,
            subject,
            body,
            status
        ) VALUES (
            student_id,
            student_email,
            NEW.id,
            'status_changed',
            'Application Status Update: ' || status_text,
            'Your application status has been updated to: ' || status_text,
            'pending'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_on_status_change
    AFTER UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION notify_on_status_change();

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE application_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE acceptance_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_schedules ENABLE ROW LEVEL SECURITY;

-- Messages: Students can view their own messages, admins can view all
CREATE POLICY "Students can view their application messages"
    ON application_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM applications a
            WHERE a.id = application_messages.application_id
            AND a.student_id = auth.uid()
        )
    );

CREATE POLICY "Students can send messages"
    ON application_messages FOR INSERT
    WITH CHECK (
        sender_type = 'student'
        AND sender_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM applications a
            WHERE a.id = application_id
            AND a.student_id = auth.uid()
        )
    );

-- Payments: Students can view their own payments
CREATE POLICY "Students can view their payments"
    ON payment_transactions FOR SELECT
    USING (student_id = auth.uid());

-- Email notifications: Users can view their own notifications
CREATE POLICY "Users can view their notifications"
    ON email_notifications FOR SELECT
    USING (recipient_id = auth.uid());

-- Notification preferences: Users can manage their own preferences
CREATE POLICY "Users can manage their notification preferences"
    ON notification_preferences FOR ALL
    USING (user_id = auth.uid());

-- Document requests: Students can view their requests
CREATE POLICY "Students can view their document requests"
    ON document_requests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM applications a
            WHERE a.id = document_requests.application_id
            AND a.student_id = auth.uid()
        )
    );

-- Acceptance letters: Students can view their letters
CREATE POLICY "Students can view their acceptance letters"
    ON acceptance_letters FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM applications a
            WHERE a.id = acceptance_letters.application_id
            AND a.student_id = auth.uid()
        )
    );

-- Interviews: Students can view their interviews
CREATE POLICY "Students can view their interviews"
    ON interview_schedules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM applications a
            WHERE a.id = interview_schedules.application_id
            AND a.student_id = auth.uid()
        )
    );

-- =====================================================
-- VIEWS
-- =====================================================

-- View for unread messages count per application
CREATE OR REPLACE VIEW v_unread_messages_count AS
SELECT 
    application_id,
    COUNT(*) as unread_count
FROM application_messages
WHERE is_read = false
GROUP BY application_id;

-- View for pending payments per student
CREATE OR REPLACE VIEW v_pending_payments AS
SELECT 
    student_id,
    application_id,
    SUM(amount) as total_pending,
    currency,
    COUNT(*) as pending_count
FROM payment_transactions
WHERE status = 'pending'
GROUP BY student_id, application_id, currency;

-- View for pending actions per student
CREATE OR REPLACE VIEW v_pending_actions AS
SELECT 
    a.student_id,
    a.id as application_id,
    COUNT(DISTINCT CASE WHEN m.requires_action = true AND m.action_completed = false THEN m.id END) as pending_messages,
    COUNT(DISTINCT CASE WHEN dr.status = 'pending' THEN dr.id END) as pending_documents,
    COUNT(DISTINCT CASE WHEN pt.status = 'pending' THEN pt.id END) as pending_payments
FROM applications a
LEFT JOIN application_messages m ON a.id = m.application_id
LEFT JOIN document_requests dr ON a.id = dr.application_id
LEFT JOIN payment_transactions pt ON a.id = pt.application_id
GROUP BY a.student_id, a.id;

COMMENT ON TABLE application_messages IS 'Messages between admin and students for each application';
COMMENT ON TABLE payment_transactions IS 'Payment transactions for applications';
COMMENT ON TABLE email_notifications IS 'Email notifications sent to users';
COMMENT ON TABLE notification_preferences IS 'User notification preferences';
COMMENT ON TABLE document_requests IS 'Document requests from admin to students';
COMMENT ON TABLE acceptance_letters IS 'Acceptance letters issued to students';
COMMENT ON TABLE interview_schedules IS 'Interview schedules for applications';
