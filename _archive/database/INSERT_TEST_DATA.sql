-- =====================================================
-- INSERT TEST DATA SCRIPT
-- =====================================================
-- This script manually inserts a payment and document request
-- to verify that the Student Dashboard can display them.

DO $$
DECLARE
    v_student_id UUID;
    v_app_id UUID := '4a23971c-9584-46ff-8d01-183c9a57bc87';
BEGIN
    -- 1. Get the student_id for the application
    SELECT student_id INTO v_student_id FROM applications WHERE id = v_app_id;
    
    IF v_student_id IS NOT NULL THEN
        -- 2. Insert Test Payment Transaction
        INSERT INTO payment_transactions (
            application_id, 
            student_id, 
            amount, 
            currency, 
            payment_type, 
            status,
            created_at
        ) VALUES (
            v_app_id,
            v_student_id,
            99.00,
            'USD',
            'application_fee',
            'pending',
            NOW()
        );
        
        -- 3. Insert Test Document Request
        INSERT INTO document_requests (
            application_id,
            document_name,
            document_type,
            status,
            description,
            created_at
        ) VALUES (
            v_app_id,
            'Test Passport Request',
            'passport',
            'pending',
            'This is a test request inserted via SQL',
            NOW()
        );
        
        RAISE NOTICE '✅ Test data inserted successfully!';
    ELSE
        RAISE NOTICE '❌ Application not found or student_id is null. Cannot insert data.';
    END IF;
END $$;
