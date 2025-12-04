-- =====================================================
-- ENABLE ADMIN DELETE FOR UNIVERSITIES
-- =====================================================
-- This script ensures that admins have the permission to delete universities.
-- It uses the public.is_admin() function if available, or falls back to a basic check.
-- =====================================================

-- 1. Ensure RLS is enabled
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- 2. Drop potentially conflicting or insecure policies
DROP POLICY IF EXISTS "Admins can manage universities" ON universities;
DROP POLICY IF EXISTS "Admins can delete universities" ON universities;
DROP POLICY IF EXISTS "Admins can update universities" ON universities;
DROP POLICY IF EXISTS "Admins can insert universities" ON universities;

-- 3. Create explicit Admin policies
-- We separate them for clarity and security

-- DELETE Policy
CREATE POLICY "Admins can delete universities"
    ON universities
    FOR DELETE
    USING (
        (SELECT count(*) FROM profiles WHERE id = auth.uid() AND role = 'admin') > 0
        OR 
        auth.role() = 'service_role'
    );

-- UPDATE Policy
CREATE POLICY "Admins can update universities"
    ON universities
    FOR UPDATE
    USING (
        (SELECT count(*) FROM profiles WHERE id = auth.uid() AND role = 'admin') > 0
        OR 
        auth.role() = 'service_role'
    )
    WITH CHECK (
        (SELECT count(*) FROM profiles WHERE id = auth.uid() AND role = 'admin') > 0
        OR 
        auth.role() = 'service_role'
    );

-- INSERT Policy
CREATE POLICY "Admins can insert universities"
    ON universities
    FOR INSERT
    WITH CHECK (
        (SELECT count(*) FROM profiles WHERE id = auth.uid() AND role = 'admin') > 0
        OR 
        auth.role() = 'service_role'
    );

-- 4. Ensure Public Read Access (if not already present)
-- We don't drop this one to avoid breaking public access if it's named differently, 
-- but we create it if it doesn't exist (Postgres doesn't support IF NOT EXISTS for policies directly, 
-- so we drop and recreate to be safe and sure).
DROP POLICY IF EXISTS "Public can view universities" ON universities;
CREATE POLICY "Public can view universities"
    ON universities
    FOR SELECT
    USING (true);

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT tablename, policyname, cmd
FROM pg_policies 
WHERE tablename = 'universities'
ORDER BY policyname;
