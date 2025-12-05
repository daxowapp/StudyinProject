-- =====================================================
-- CREATE ADMIN USER
-- =====================================================
-- This script creates an admin user in Supabase
-- Email: admin@studyatchina.com
-- Password: 123456
-- 
-- IMPORTANT: Run this in Supabase SQL Editor
-- =====================================================

-- First, check if user already exists
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'admin@studyatchina.com';

-- If user exists, you can update their metadata to ensure admin role:
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
    ),
    raw_user_meta_data = jsonb_set(
        raw_user_meta_data,
        '{full_name}',
        '"Admin User"'
    )
WHERE email = 'admin@studyatchina.com';

-- =====================================================
-- NOTE: You cannot create users directly via SQL
-- =====================================================
-- For security reasons, Supabase requires you to use:
-- 1. Supabase Dashboard (Authentication > Users > Add User)
-- 2. Supabase Admin API (via Node.js script)
-- 3. Auth signup flow
--
-- Use the Node.js script below for automated creation
-- =====================================================
