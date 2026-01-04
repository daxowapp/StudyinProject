-- =====================================================
-- FIX ALL USER ROLES AND RLS POLICIES
-- =====================================================
-- This script adds all user roles with their proper permissions:
-- 1. admin       - Full access to everything
-- 2. marketing   - Applications, leads, content, analytics
-- 3. data_entry  - Academic management (universities, programs, scholarships, etc.)
-- 4. student     - Regular users (default)

-- =====================================================
-- 1. UPDATE THE ROLE CHECK CONSTRAINT
-- =====================================================
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'admin', 'marketing', 'data_entry'));

-- =====================================================
-- 2. CREATE HELPER FUNCTIONS FOR ROLE CHECKS
-- =====================================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is marketing
CREATE OR REPLACE FUNCTION public.is_marketing()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'marketing'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is data_entry
CREATE OR REPLACE FUNCTION public.is_data_entry()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'data_entry'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can manage academic content (admin OR data_entry)
CREATE OR REPLACE FUNCTION public.can_manage_academic_content()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'data_entry')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can manage applications and leads (admin OR marketing)
CREATE OR REPLACE FUNCTION public.can_manage_applications()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'marketing')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has any staff role (admin, marketing, or data_entry)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'marketing', 'data_entry')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. FIX RLS POLICIES FOR UNIVERSITIES
-- =====================================================
DROP POLICY IF EXISTS "Admins can do everything on universities" ON public.universities;
DROP POLICY IF EXISTS "Content managers can do everything on universities" ON public.universities;
DROP POLICY IF EXISTS "Academic managers can do everything on universities" ON public.universities;

CREATE POLICY "Academic managers can do everything on universities" ON public.universities
  FOR ALL USING (public.can_manage_academic_content());

-- =====================================================
-- 4. FIX RLS POLICIES FOR PROGRAMS
-- =====================================================
DROP POLICY IF EXISTS "Admins can do everything on programs" ON public.programs;
DROP POLICY IF EXISTS "Content managers can do everything on programs" ON public.programs;
DROP POLICY IF EXISTS "Academic managers can do everything on programs" ON public.programs;

CREATE POLICY "Academic managers can do everything on programs" ON public.programs
  FOR ALL USING (public.can_manage_academic_content());

-- =====================================================
-- 5. FIX RLS POLICIES FOR SCHOLARSHIPS (if exists)
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'scholarships') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can do everything on scholarships" ON public.scholarships';
    EXECUTE 'DROP POLICY IF EXISTS "Academic managers can do everything on scholarships" ON public.scholarships';
    EXECUTE 'CREATE POLICY "Academic managers can do everything on scholarships" ON public.scholarships FOR ALL USING (public.can_manage_academic_content())';
    RAISE NOTICE '✅ Scholarships RLS updated';
  END IF;
END $$;

-- =====================================================
-- 6. FIX RLS POLICIES FOR ACADEMIC YEARS
-- =====================================================
DROP POLICY IF EXISTS "Admins can do everything on academic_years" ON public.academic_years;
DROP POLICY IF EXISTS "Academic managers can do everything on academic_years" ON public.academic_years;

CREATE POLICY "Academic managers can do everything on academic_years" ON public.academic_years
  FOR ALL USING (public.can_manage_academic_content());

-- =====================================================
-- 7. FIX RLS POLICIES FOR INTAKES
-- =====================================================
DROP POLICY IF EXISTS "Admins can do everything on intakes" ON public.intakes;
DROP POLICY IF EXISTS "Academic managers can do everything on intakes" ON public.intakes;

CREATE POLICY "Academic managers can do everything on intakes" ON public.intakes
  FOR ALL USING (public.can_manage_academic_content());

-- =====================================================
-- 8. FIX RLS POLICIES FOR LANGUAGES
-- =====================================================
DROP POLICY IF EXISTS "Admins can do everything on languages" ON public.languages;
DROP POLICY IF EXISTS "Academic managers can do everything on languages" ON public.languages;

CREATE POLICY "Academic managers can do everything on languages" ON public.languages
  FOR ALL USING (public.can_manage_academic_content());

-- =====================================================
-- 9. FIX RLS POLICIES FOR LEADS (marketing team)
-- =====================================================
DROP POLICY IF EXISTS "Admins can do everything on leads" ON public.leads;
DROP POLICY IF EXISTS "Marketing can manage leads" ON public.leads;

CREATE POLICY "Marketing can manage leads" ON public.leads
  FOR ALL USING (public.can_manage_applications());

-- =====================================================
-- 10. FIX RLS POLICIES FOR APPLICATIONS (marketing team)
-- =====================================================
-- Keep existing user policies, add marketing access
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
DROP POLICY IF EXISTS "Marketing can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Marketing can update applications" ON public.applications;

CREATE POLICY "Marketing can view all applications" ON public.applications
  FOR SELECT USING (public.can_manage_applications());

CREATE POLICY "Marketing can update applications" ON public.applications
  FOR UPDATE USING (public.can_manage_applications());

-- =====================================================
-- 11. SET THE DATA ENTRY USER'S ROLE
-- =====================================================
UPDATE public.profiles 
SET role = 'data_entry' 
WHERE email = 'ecebulutt97@gmail.com';

-- If profile doesn't exist, insert it
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'data_entry' 
FROM auth.users 
WHERE email = 'ecebulutt97@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'data_entry';

-- =====================================================
-- 12. VERIFY THE CHANGES
-- =====================================================
DO $$
DECLARE
    user_role TEXT;
    role_count INTEGER;
BEGIN
    -- Check the user's role
    SELECT role INTO user_role FROM public.profiles WHERE email = 'ecebulutt97@gmail.com';
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE '✅ ALL USER ROLES AND RLS POLICIES UPDATED';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Available roles:';
    RAISE NOTICE '  • admin      - Full access to everything';
    RAISE NOTICE '  • marketing  - Applications, leads, content, analytics';
    RAISE NOTICE '  • data_entry - Universities, programs, scholarships, etc.';
    RAISE NOTICE '  • student    - Regular users (default)';
    RAISE NOTICE '';
    RAISE NOTICE 'User ecebulutt97@gmail.com now has role: %', COALESCE(user_role, 'NOT FOUND');
    RAISE NOTICE '';
    
    -- Count users by role
    RAISE NOTICE 'Current user distribution:';
    FOR user_role, role_count IN 
        SELECT p.role, COUNT(*) FROM public.profiles p GROUP BY p.role ORDER BY p.role
    LOOP
        RAISE NOTICE '  • % : % users', user_role, role_count;
    END LOOP;
END $$;

-- Show the updated profile
SELECT id, email, role, created_at 
FROM public.profiles 
WHERE email = 'ecebulutt97@gmail.com';
