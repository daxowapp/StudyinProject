-- =====================================================
-- FIX ADMIN ROLE ASSIGNMENT BUG
-- =====================================================
-- This script hardens the handle_new_user trigger to prevent
-- new users from being assigned the 'admin' role via metadata.
-- =====================================================

-- 1. Update the handle_new_user function to FORCE 'student' role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    'student' -- HARDCODED: Always start as student, ignore metadata
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure the profiles table default is also 'student' (safety net)
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'student';

-- 3. (Optional) Audit existing users to find potential unauthorized admins
-- Run this query manually to check:
-- SELECT * FROM public.profiles WHERE role = 'admin';
