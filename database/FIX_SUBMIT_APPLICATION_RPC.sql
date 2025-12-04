-- =====================================================
-- FIX: SUBMIT APPLICATION RPC
-- =====================================================
-- The user reported "Could not find the function", which means
-- this function was likely never created in the database.
-- This script creates it.
-- =====================================================

CREATE OR REPLACE FUNCTION submit_application(
    p_student_id UUID,
    p_program_id UUID,
    p_application_data JSONB,
    p_documents_data JSONB,
    p_profile_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with admin privileges to bypass RLS during submission
AS $$
DECLARE
    v_application_id UUID;
    v_doc JSONB;
BEGIN
    -- 1. Insert Application
    INSERT INTO applications (
        student_id,
        university_program_id,
        student_name,
        student_email,
        student_phone,
        student_country,
        student_passport,
        preferred_intake,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relationship,
        status,
        payment_amount,
        payment_currency,
        documents_complete
    ) VALUES (
        p_student_id,
        p_program_id,
        p_application_data->>'student_name',
        p_application_data->>'student_email',
        p_application_data->>'student_phone',
        p_application_data->>'student_country',
        p_application_data->>'student_passport',
        p_application_data->>'preferred_intake',
        p_application_data->>'emergency_contact_name',
        p_application_data->>'emergency_contact_phone',
        p_application_data->>'emergency_contact_relationship',
        p_application_data->>'status',
        (p_application_data->>'payment_amount')::numeric,
        p_application_data->>'payment_currency',
        (p_application_data->>'documents_complete')::boolean
    )
    RETURNING id INTO v_application_id;

    -- 2. Insert Application Documents
    IF p_documents_data IS NOT NULL AND jsonb_array_length(p_documents_data) > 0 THEN
        FOR v_doc IN SELECT * FROM jsonb_array_elements(p_documents_data)
        LOOP
            INSERT INTO application_documents (
                application_id,
                requirement_id,
                document_name,
                document_type,
                file_url,
                file_size,
                file_type
            ) VALUES (
                v_application_id,
                (v_doc->>'requirement_id')::uuid,
                v_doc->>'document_name',
                v_doc->>'document_type',
                v_doc->>'file_url',
                (v_doc->>'file_size')::numeric,
                v_doc->>'file_type'
            );
        END LOOP;
    END IF;

    -- 3. Update Profile
    UPDATE profiles
    SET
        full_name = p_profile_data->>'full_name',
        phone = p_profile_data->>'phone',
        phone_country_code = p_profile_data->>'phone_country_code',
        nationality = p_profile_data->>'nationality',
        passport_number = p_profile_data->>'passport_number',
        emergency_contact_name = p_profile_data->>'emergency_contact_name',
        emergency_contact_phone = p_profile_data->>'emergency_contact_phone',
        emergency_phone_code = p_profile_data->>'emergency_phone_code',
        emergency_contact_relationship = p_profile_data->>'emergency_contact_relationship',
        profile_completed_at = NOW()
    WHERE id = p_student_id;

    RETURN jsonb_build_object(
        'success', true,
        'application_id', v_application_id
    );

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;
