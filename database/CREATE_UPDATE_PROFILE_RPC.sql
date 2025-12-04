-- =====================================================
-- RPC: UPDATE PROFILE (SECURITY DEFINER)
-- =====================================================
-- This function handles profile updates with elevated privileges
-- to bypass RLS issues.
-- =====================================================

CREATE OR REPLACE FUNCTION update_profile(
    p_user_id UUID,
    p_profile_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- <--- Runs with admin privileges
AS $$
BEGIN
    -- Update Profile
    UPDATE profiles
    SET
        full_name = COALESCE(p_profile_data->>'full_name', full_name),
        phone = COALESCE(p_profile_data->>'phone', phone),
        phone_country_code = COALESCE(p_profile_data->>'phone_country_code', phone_country_code),
        nationality = COALESCE(p_profile_data->>'nationality', nationality),
        passport_number = COALESCE(p_profile_data->>'passport_number', passport_number),
        date_of_birth = CASE 
            WHEN p_profile_data->>'date_of_birth' IS NOT NULL AND p_profile_data->>'date_of_birth' != '' 
            THEN (p_profile_data->>'date_of_birth')::date 
            ELSE date_of_birth 
        END,
        address = COALESCE(p_profile_data->>'address', address),
        city = COALESCE(p_profile_data->>'city', city),
        postal_code = COALESCE(p_profile_data->>'postal_code', postal_code),
        emergency_contact_name = COALESCE(p_profile_data->>'emergency_contact_name', emergency_contact_name),
        emergency_contact_phone = COALESCE(p_profile_data->>'emergency_contact_phone', emergency_contact_phone),
        emergency_phone_code = COALESCE(p_profile_data->>'emergency_phone_code', emergency_phone_code),
        emergency_contact_relationship = COALESCE(p_profile_data->>'emergency_contact_relationship', emergency_contact_relationship),
        profile_photo_url = COALESCE(p_profile_data->>'profile_photo_url', profile_photo_url),
        updated_at = NOW()
    WHERE id = p_user_id;

    RETURN jsonb_build_object('success', true);

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;
