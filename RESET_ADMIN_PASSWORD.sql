-- =====================================================
-- RESET ADMIN PASSWORD
-- =====================================================
-- This script resets the admin password
-- Run this in your Supabase SQL Editor

-- Method 1: Update admin user password directly
-- Replace 'admin@studyatchina.com' with your admin email
-- Replace 'NewSecurePassword123!' with your desired password

-- First, let's find the admin user
SELECT id, email, role 
FROM auth.users 
WHERE email = 'ahmed@studyinturkiye.com';

-- To reset password, you need to use Supabase Auth Admin API
-- You cannot directly update passwords in SQL for security reasons

-- =====================================================
-- ALTERNATIVE: Create a password reset link
-- =====================================================

-- You can generate a password reset link via Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Find the admin user
-- 3. Click the three dots menu
-- 4. Select "Send password reset email"

-- =====================================================
-- OR: Create a new admin user if needed
-- =====================================================

-- If you need to create a new admin user, use this:
-- (This creates the user in auth.users, you'll need to set password via email)

-- INSERT INTO auth.users (
--     instance_id,
--     id,
--     aud,
--     role,
--     email,
--     encrypted_password,
--     email_confirmed_at,
--     raw_app_meta_data,
--     raw_user_meta_data,
--     created_at,
--     updated_at,
--     confirmation_token,
--     email_change,
--     email_change_token_new,
--     recovery_token
-- ) VALUES (
--     '00000000-0000-0000-0000-000000000000',
--     gen_random_uuid(),
--     'authenticated',
--     'authenticated',
--     'admin@studyatchina.com',
--     crypt('YourPasswordHere', gen_salt('bf')),
--     NOW(),
--     '{"provider":"email","providers":["email"],"role":"admin"}',
--     '{"role":"admin","full_name":"Admin User"}',
--     NOW(),
--     NOW(),
--     '',
--     '',
--     '',
--     ''
-- );

-- =====================================================
-- RECOMMENDED METHOD: Use Supabase CLI or Dashboard
-- =====================================================

-- Option 1: Via Supabase Dashboard
-- 1. Go to https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to Authentication > Users
-- 4. Find admin@studyatchina.com
-- 5. Click "..." menu > "Send password reset email"
-- 6. Check email and reset password

-- Option 2: Via Supabase CLI
-- Run this command in your terminal:
-- supabase auth users reset-password admin@studyatchina.com

-- =====================================================
-- VERIFY ADMIN USER EXISTS
-- =====================================================

-- Check if admin user exists and has correct role
SELECT 
    id,
    email,
    raw_user_meta_data->>'role' as user_role,
    email_confirmed_at,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE email = 'ahmed@studyinturkiye.com';

-- =====================================================
-- UPDATE ADMIN METADATA (if needed)
-- =====================================================

-- Update admin user metadata to ensure role is set
UPDATE auth.users
SET 
    raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
    ),
    raw_app_meta_data = jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
    )
WHERE email = 'ahmed@studyinturkiye.com';

-- =====================================================
-- NOTES
-- =====================================================

-- For security reasons, Supabase doesn't allow direct password updates via SQL
-- You must use one of these methods:
-- 
-- 1. Supabase Dashboard (Recommended)
-- 2. Supabase Auth API
-- 3. Password reset email flow
-- 4. Supabase CLI
--
-- Default admin credentials (if you created via signup):
-- Email: admin@studyatchina.com
-- Password: (whatever you set during signup)
--
-- If you forgot the password, use the password reset flow
