-- =====================================================
-- COMPLETE FIX: ALL USER ROLES AND RLS POLICIES
-- =====================================================
-- Run this ONCE to fix all RLS for all user types:
-- 
-- ROLES:
--   admin       - Full access to everything
--   marketing   - Applications, leads, documents, content, analytics
--   data_entry  - Universities, programs, scholarships, academic management
--   student     - Regular users (default)
--
-- This script:
-- 1. Updates the role constraint to allow all 4 roles
-- 2. Creates helper functions for role checks
-- 3. Updates all RLS policies to use the correct role checks
-- =====================================================

-- =====================================================
-- STEP 1: UPDATE ROLE CONSTRAINT
-- =====================================================
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'admin', 'marketing', 'data_entry'));

-- =====================================================
-- STEP 2: CREATE/UPDATE HELPER FUNCTIONS
-- =====================================================

-- Check if user is admin (keep existing)
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

-- ACADEMIC CONTENT: admin + data_entry can manage
-- (universities, programs, scholarships, academic_years, intakes, languages)
CREATE OR REPLACE FUNCTION public.can_manage_academic_content()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'data_entry')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- APPLICATIONS/LEADS: admin + marketing can manage
CREATE OR REPLACE FUNCTION public.can_manage_applications()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'marketing')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CONTENT/ARTICLES: admin + marketing can manage
CREATE OR REPLACE FUNCTION public.can_manage_content()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'marketing')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ANY STAFF ROLE: admin, marketing, or data_entry
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
-- STEP 3: FIX RLS FOR ACADEMIC TABLES (data_entry access)
-- =====================================================

-- UNIVERSITIES
DROP POLICY IF EXISTS "Admins can do everything on universities" ON public.universities;
DROP POLICY IF EXISTS "Academic managers can do everything on universities" ON public.universities;
CREATE POLICY "Academic managers can do everything on universities" ON public.universities
  FOR ALL USING (public.can_manage_academic_content());

-- PROGRAMS
DROP POLICY IF EXISTS "Admins can do everything on programs" ON public.programs;
DROP POLICY IF EXISTS "Academic managers can do everything on programs" ON public.programs;
CREATE POLICY "Academic managers can do everything on programs" ON public.programs
  FOR ALL USING (public.can_manage_academic_content());

-- ACADEMIC_YEARS
DROP POLICY IF EXISTS "Admins can do everything on academic_years" ON public.academic_years;
DROP POLICY IF EXISTS "Academic managers can do everything on academic_years" ON public.academic_years;
CREATE POLICY "Academic managers can do everything on academic_years" ON public.academic_years
  FOR ALL USING (public.can_manage_academic_content());

-- INTAKES
DROP POLICY IF EXISTS "Admins can do everything on intakes" ON public.intakes;
DROP POLICY IF EXISTS "Academic managers can do everything on intakes" ON public.intakes;
CREATE POLICY "Academic managers can do everything on intakes" ON public.intakes
  FOR ALL USING (public.can_manage_academic_content());

-- LANGUAGES
DROP POLICY IF EXISTS "Admins can do everything on languages" ON public.languages;
DROP POLICY IF EXISTS "Academic managers can do everything on languages" ON public.languages;
CREATE POLICY "Academic managers can do everything on languages" ON public.languages
  FOR ALL USING (public.can_manage_academic_content());

-- UNIVERSITY_PROGRAMS (if exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'university_programs') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can do everything on university_programs" ON public.university_programs';
    EXECUTE 'DROP POLICY IF EXISTS "Academic managers can do everything on university_programs" ON public.university_programs';
    EXECUTE 'CREATE POLICY "Academic managers can do everything on university_programs" ON public.university_programs FOR ALL USING (public.can_manage_academic_content())';
    RAISE NOTICE '✅ university_programs policies updated';
  END IF;
END $$;

-- PROGRAM_CATALOG (if exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'program_catalog') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can do everything on program_catalog" ON public.program_catalog';
    EXECUTE 'DROP POLICY IF EXISTS "Academic managers can do everything on program_catalog" ON public.program_catalog';
    EXECUTE 'CREATE POLICY "Academic managers can do everything on program_catalog" ON public.program_catalog FOR ALL USING (public.can_manage_academic_content())';
    RAISE NOTICE '✅ program_catalog policies updated';
  END IF;
END $$;

-- UNIVERSITY_SCHOLARSHIPS (if exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'university_scholarships') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can do everything on university_scholarships" ON public.university_scholarships';
    EXECUTE 'DROP POLICY IF EXISTS "Academic managers can do everything on university_scholarships" ON public.university_scholarships';
    EXECUTE 'CREATE POLICY "Academic managers can do everything on university_scholarships" ON public.university_scholarships FOR ALL USING (public.can_manage_academic_content())';
    RAISE NOTICE '✅ university_scholarships policies updated';
  END IF;
END $$;

-- ADMISSION_REQUIREMENTS_CATALOG (if exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admission_requirements_catalog') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can do everything on admission_requirements_catalog" ON public.admission_requirements_catalog';
    EXECUTE 'DROP POLICY IF EXISTS "Academic managers can do everything on admission_requirements_catalog" ON public.admission_requirements_catalog';
    EXECUTE 'CREATE POLICY "Academic managers can do everything on admission_requirements_catalog" ON public.admission_requirements_catalog FOR ALL USING (public.can_manage_academic_content())';
    RAISE NOTICE '✅ admission_requirements_catalog policies updated';
  END IF;
END $$;

-- UNIVERSITY_ADMISSION_REQUIREMENTS (if exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'university_admission_requirements') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can do everything on university_admission_requirements" ON public.university_admission_requirements';
    EXECUTE 'DROP POLICY IF EXISTS "Academic managers can do everything on university_admission_requirements" ON public.university_admission_requirements';
    EXECUTE 'CREATE POLICY "Academic managers can do everything on university_admission_requirements" ON public.university_admission_requirements FOR ALL USING (public.can_manage_academic_content())';
    RAISE NOTICE '✅ university_admission_requirements policies updated';
  END IF;
END $$;

-- UNIVERSITY_ACCOMMODATION (if exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'university_accommodation') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can do everything on university_accommodation" ON public.university_accommodation';
    EXECUTE 'DROP POLICY IF EXISTS "Academic managers can do everything on university_accommodation" ON public.university_accommodation';
    EXECUTE 'CREATE POLICY "Academic managers can do everything on university_accommodation" ON public.university_accommodation FOR ALL USING (public.can_manage_academic_content())';
    RAISE NOTICE '✅ university_accommodation policies updated';
  END IF;
END $$;

-- TRANSLATION TABLES
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'university_translations') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can do everything on university_translations" ON public.university_translations';
    EXECUTE 'DROP POLICY IF EXISTS "Academic managers can do everything on university_translations" ON public.university_translations';
    EXECUTE 'CREATE POLICY "Academic managers can do everything on university_translations" ON public.university_translations FOR ALL USING (public.can_manage_academic_content())';
    RAISE NOTICE '✅ university_translations policies updated';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'scholarship_translations') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can do everything on scholarship_translations" ON public.scholarship_translations';
    EXECUTE 'DROP POLICY IF EXISTS "Academic managers can do everything on scholarship_translations" ON public.scholarship_translations';
    EXECUTE 'CREATE POLICY "Academic managers can do everything on scholarship_translations" ON public.scholarship_translations FOR ALL USING (public.can_manage_academic_content())';
    RAISE NOTICE '✅ scholarship_translations policies updated';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'program_translations') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can do everything on program_translations" ON public.program_translations';
    EXECUTE 'DROP POLICY IF EXISTS "Academic managers can do everything on program_translations" ON public.program_translations';
    EXECUTE 'CREATE POLICY "Academic managers can do everything on program_translations" ON public.program_translations FOR ALL USING (public.can_manage_academic_content())';
    RAISE NOTICE '✅ program_translations policies updated';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'accommodation_translations') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can do everything on accommodation_translations" ON public.accommodation_translations';
    EXECUTE 'DROP POLICY IF EXISTS "Academic managers can do everything on accommodation_translations" ON public.accommodation_translations';
    EXECUTE 'CREATE POLICY "Academic managers can do everything on accommodation_translations" ON public.accommodation_translations FOR ALL USING (public.can_manage_academic_content())';
    RAISE NOTICE '✅ accommodation_translations policies updated';
  END IF;
END $$;

-- =====================================================
-- STEP 4: FIX RLS FOR MARKETING TABLES
-- =====================================================

-- LEADS
DROP POLICY IF EXISTS "Admins can do everything on leads" ON public.leads;
DROP POLICY IF EXISTS "Marketing can manage leads" ON public.leads;
CREATE POLICY "Marketing can manage leads" ON public.leads
  FOR ALL USING (public.can_manage_applications());

-- APPLICATIONS (extend existing policies)
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
DROP POLICY IF EXISTS "Marketing can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Marketing can update applications" ON public.applications;

CREATE POLICY "Marketing can view all applications" ON public.applications
  FOR SELECT USING (public.can_manage_applications());

CREATE POLICY "Marketing can update applications" ON public.applications
  FOR UPDATE USING (public.can_manage_applications());

-- ARTICLES (if exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'articles') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can do everything on articles" ON public.articles';
    EXECUTE 'DROP POLICY IF EXISTS "Content managers can do everything on articles" ON public.articles';
    EXECUTE 'CREATE POLICY "Content managers can do everything on articles" ON public.articles FOR ALL USING (public.can_manage_content())';
    RAISE NOTICE '✅ articles policies updated';
  END IF;
END $$;

-- ARTICLE_TRANSLATIONS (if exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'article_translations') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can do everything on article_translations" ON public.article_translations';
    EXECUTE 'DROP POLICY IF EXISTS "Content managers can do everything on article_translations" ON public.article_translations';
    EXECUTE 'CREATE POLICY "Content managers can do everything on article_translations" ON public.article_translations FOR ALL USING (public.can_manage_content())';
    RAISE NOTICE '✅ article_translations policies updated';
  END IF;
END $$;

-- APPLICATION_MESSAGES (if exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'application_messages') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can manage application messages" ON public.application_messages';
    EXECUTE 'DROP POLICY IF EXISTS "Staff can manage application messages" ON public.application_messages';
    EXECUTE 'CREATE POLICY "Staff can manage application messages" ON public.application_messages FOR ALL USING (public.can_manage_applications())';
    RAISE NOTICE '✅ application_messages policies updated';
  END IF;
END $$;

-- DOCUMENT_REQUESTS (if exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'document_requests') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can manage document requests" ON public.document_requests';
    EXECUTE 'DROP POLICY IF EXISTS "Staff can manage document requests" ON public.document_requests';
    EXECUTE 'CREATE POLICY "Staff can manage document requests" ON public.document_requests FOR ALL USING (public.can_manage_applications())';
    RAISE NOTICE '✅ document_requests policies updated';
  END IF;
END $$;

-- =====================================================
-- STEP 5: SET ecebulutt97@gmail.com AS data_entry
-- =====================================================
UPDATE public.profiles 
SET role = 'data_entry' 
WHERE email = 'ecebulutt97@gmail.com';

INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'data_entry' 
FROM auth.users 
WHERE email = 'ecebulutt97@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'data_entry';

-- =====================================================
-- STEP 6: VERIFICATION
-- =====================================================
DO $$
DECLARE
    user_role TEXT;
    role_name TEXT;
    role_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE '✅ ALL USER ROLES AND RLS POLICIES FIXED!';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'ROLE PERMISSIONS:';
    RAISE NOTICE '  admin       → Full access to everything';
    RAISE NOTICE '  marketing   → Applications, leads, documents, articles';
    RAISE NOTICE '  data_entry  → Universities, programs, scholarships, etc.';
    RAISE NOTICE '  student     → Own profile and applications only';
    RAISE NOTICE '';
    
    SELECT role INTO user_role FROM public.profiles WHERE email = 'ecebulutt97@gmail.com';
    RAISE NOTICE 'User ecebulutt97@gmail.com role: %', COALESCE(user_role, 'NOT FOUND');
    RAISE NOTICE '';
    
    RAISE NOTICE 'Current users by role:';
    FOR role_name, role_count IN 
        SELECT p.role, COUNT(*) FROM public.profiles p GROUP BY p.role ORDER BY p.role
    LOOP
        RAISE NOTICE '  %-12s : % users', role_name, role_count;
    END LOOP;
    RAISE NOTICE '';
    RAISE NOTICE 'Tell the user to LOG OUT and LOG BACK IN for changes to take effect.';
END $$;

-- Show the result
SELECT id, email, role, created_at 
FROM public.profiles 
WHERE role IN ('admin', 'marketing', 'data_entry')
ORDER BY role, email;
