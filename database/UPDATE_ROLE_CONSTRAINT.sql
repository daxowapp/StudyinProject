-- Update the check constraint on profiles table to allow new roles

-- 1. Drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Add the new constraint with all roles
ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'student', 'data_entry', 'marketing'));

-- 3. Comment to verify
COMMENT ON CONSTRAINT profiles_role_check ON profiles IS 'Allowed user roles: admin, student, data_entry, marketing';
