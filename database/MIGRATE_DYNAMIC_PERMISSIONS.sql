-- =====================================================
-- DYNAMIC ROLE-BASED PERMISSION SYSTEM
-- =====================================================
-- This migration creates a flexible permission system where:
-- 1. Roles are stored in a table (not hardcoded strings)
-- 2. Permissions define what actions can be done on which modules
-- 3. Roles have many-to-many relationship with permissions
-- 4. Users are assigned a role_id instead of role string
-- =====================================================

-- =====================================================
-- STEP 1: CREATE ROLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- e.g., 'admin', 'data_entry', 'marketing'
    display_name TEXT NOT NULL, -- e.g., 'Admin', 'Data Entry', 'Marketing & Leads'
    description TEXT,
    is_system BOOLEAN DEFAULT false, -- System roles can't be deleted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================================================
-- STEP 2: CREATE PERMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module TEXT NOT NULL, -- e.g., 'universities', 'programs', 'applications'
    action TEXT NOT NULL, -- e.g., 'view', 'create', 'edit', 'delete'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(module, action)
);

-- =====================================================
-- STEP 3: CREATE ROLE_PERMISSIONS JUNCTION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(role_id, permission_id)
);

-- =====================================================
-- STEP 4: ADD role_id TO PROFILES (keep old role column for migration)
-- =====================================================
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'role_id') THEN
        ALTER TABLE public.profiles ADD COLUMN role_id UUID REFERENCES public.roles(id);
    END IF;
END $$;

-- =====================================================
-- STEP 5: CREATE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_permissions_module ON public.permissions(module);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON public.role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role_id ON public.profiles(role_id);

-- =====================================================
-- STEP 6: ENABLE RLS
-- =====================================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 7: CREATE PERMISSION CHECK FUNCTION
-- =====================================================
-- This function checks if the current user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(p_module TEXT, p_action TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_has_permission BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM public.profiles p
        JOIN public.role_permissions rp ON rp.role_id = p.role_id
        JOIN public.permissions perm ON perm.id = rp.permission_id
        WHERE p.id = auth.uid()
          AND perm.module = p_module
          AND perm.action = p_action
    ) INTO v_has_permission;
    
    RETURN COALESCE(v_has_permission, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function to check if user is admin (for backward compatibility and role management)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN public.roles r ON r.id = p.role_id
        WHERE p.id = auth.uid() AND r.name = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to get all permissions for current user
CREATE OR REPLACE FUNCTION public.get_user_permissions()
RETURNS TABLE (module TEXT, action TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT perm.module, perm.action
    FROM public.profiles p
    JOIN public.role_permissions rp ON rp.role_id = p.role_id
    JOIN public.permissions perm ON perm.id = rp.permission_id
    WHERE p.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =====================================================
-- STEP 8: RLS POLICIES FOR NEW TABLES
-- =====================================================

-- Roles: Everyone can read, only admin can modify
DROP POLICY IF EXISTS "Anyone can view roles" ON public.roles;
CREATE POLICY "Anyone can view roles" ON public.roles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage roles" ON public.roles;
CREATE POLICY "Admin can manage roles" ON public.roles
    FOR ALL USING (public.is_admin());

-- Permissions: Everyone can read, only admin can modify
DROP POLICY IF EXISTS "Anyone can view permissions" ON public.permissions;
CREATE POLICY "Anyone can view permissions" ON public.permissions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage permissions" ON public.permissions;
CREATE POLICY "Admin can manage permissions" ON public.permissions
    FOR ALL USING (public.is_admin());

-- Role Permissions: Everyone can read, only admin can modify
DROP POLICY IF EXISTS "Anyone can view role_permissions" ON public.role_permissions;
CREATE POLICY "Anyone can view role_permissions" ON public.role_permissions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage role_permissions" ON public.role_permissions;
CREATE POLICY "Admin can manage role_permissions" ON public.role_permissions
    FOR ALL USING (public.is_admin());

-- =====================================================
-- STEP 9: SEED DEFAULT PERMISSIONS
-- =====================================================
INSERT INTO public.permissions (module, action, description) VALUES
    -- Dashboard & Analytics
    ('dashboard', 'view', 'View admin dashboard'),
    ('analytics', 'view', 'View analytics and reports'),
    
    -- Universities
    ('universities', 'view', 'View universities'),
    ('universities', 'create', 'Create new universities'),
    ('universities', 'edit', 'Edit existing universities'),
    ('universities', 'delete', 'Delete universities'),
    
    -- Programs
    ('programs', 'view', 'View programs'),
    ('programs', 'create', 'Create new programs'),
    ('programs', 'edit', 'Edit existing programs'),
    ('programs', 'delete', 'Delete programs'),
    
    -- Scholarships
    ('scholarships', 'view', 'View scholarships'),
    ('scholarships', 'create', 'Create new scholarships'),
    ('scholarships', 'edit', 'Edit existing scholarships'),
    ('scholarships', 'delete', 'Delete scholarships'),
    
    -- Academic Years
    ('academic_years', 'view', 'View academic years'),
    ('academic_years', 'create', 'Create new academic years'),
    ('academic_years', 'edit', 'Edit existing academic years'),
    ('academic_years', 'delete', 'Delete academic years'),
    
    -- Languages
    ('languages', 'view', 'View languages'),
    ('languages', 'create', 'Create new languages'),
    ('languages', 'edit', 'Edit existing languages'),
    ('languages', 'delete', 'Delete languages'),
    
    -- Admission Requirements
    ('admission_requirements', 'view', 'View admission requirements'),
    ('admission_requirements', 'create', 'Create new admission requirements'),
    ('admission_requirements', 'edit', 'Edit existing admission requirements'),
    ('admission_requirements', 'delete', 'Delete admission requirements'),
    
    -- Program Catalog
    ('program_catalog', 'view', 'View program catalog'),
    ('program_catalog', 'create', 'Create catalog entries'),
    ('program_catalog', 'edit', 'Edit catalog entries'),
    ('program_catalog', 'delete', 'Delete catalog entries'),
    
    -- Applications
    ('applications', 'view', 'View student applications'),
    ('applications', 'edit', 'Update application status'),
    
    -- Leads
    ('leads', 'view', 'View leads'),
    ('leads', 'create', 'Create new leads'),
    ('leads', 'edit', 'Edit existing leads'),
    ('leads', 'delete', 'Delete leads'),
    
    -- Documents
    ('documents', 'view', 'View student documents'),
    ('documents', 'edit', 'Verify/reject documents'),
    
    -- Users
    ('users', 'view', 'View users'),
    ('users', 'create', 'Create new users'),
    ('users', 'edit', 'Edit existing users'),
    ('users', 'delete', 'Delete users'),
    
    -- Roles
    ('roles', 'view', 'View roles'),
    ('roles', 'create', 'Create new roles'),
    ('roles', 'edit', 'Edit existing roles'),
    ('roles', 'delete', 'Delete roles'),
    
    -- Articles
    ('articles', 'view', 'View articles'),
    ('articles', 'create', 'Create new articles'),
    ('articles', 'edit', 'Edit existing articles'),
    ('articles', 'delete', 'Delete articles'),
    
    -- Messages
    ('messages', 'view', 'View messages'),
    ('messages', 'send', 'Send messages to students'),
    
    -- Refunds
    ('refunds', 'view', 'View refund requests'),
    ('refunds', 'approve', 'Approve/reject refund requests'),
    
    -- Settings
    ('settings', 'view', 'View system settings'),
    ('settings', 'edit', 'Edit system settings')
ON CONFLICT (module, action) DO NOTHING;

-- =====================================================
-- STEP 10: SEED DEFAULT ROLES
-- =====================================================
INSERT INTO public.roles (name, display_name, description, is_system) VALUES
    ('admin', 'Administrator', 'Full access to all features and settings', true),
    ('data_entry', 'Data Entry', 'Can manage universities, programs, and academic content', true),
    ('marketing', 'Marketing & Leads', 'Can manage applications, leads, and content', true),
    ('student', 'Student', 'Regular student account with portal access', true)
ON CONFLICT (name) DO UPDATE SET 
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    is_system = EXCLUDED.is_system;

-- =====================================================
-- STEP 11: ASSIGN PERMISSIONS TO DEFAULT ROLES
-- =====================================================
DO $$
DECLARE
    v_admin_id UUID;
    v_data_entry_id UUID;
    v_marketing_id UUID;
    v_student_id UUID;
BEGIN
    -- Get role IDs
    SELECT id INTO v_admin_id FROM public.roles WHERE name = 'admin';
    SELECT id INTO v_data_entry_id FROM public.roles WHERE name = 'data_entry';
    SELECT id INTO v_marketing_id FROM public.roles WHERE name = 'marketing';
    SELECT id INTO v_student_id FROM public.roles WHERE name = 'student';

    -- ADMIN: Gets ALL permissions
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_admin_id, id FROM public.permissions
    ON CONFLICT (role_id, permission_id) DO NOTHING;

    -- DATA_ENTRY: Academic content management
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_data_entry_id, p.id 
    FROM public.permissions p
    WHERE p.module IN ('dashboard', 'universities', 'programs', 'scholarships', 
                       'academic_years', 'languages', 'admission_requirements', 'program_catalog')
    ON CONFLICT (role_id, permission_id) DO NOTHING;

    -- MARKETING: Applications, leads, content
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_marketing_id, p.id 
    FROM public.permissions p
    WHERE p.module IN ('dashboard', 'analytics', 'applications', 'leads', 
                       'documents', 'articles', 'messages')
    ON CONFLICT (role_id, permission_id) DO NOTHING;

    -- STUDENT: No admin permissions (they use the student portal)
    -- No permissions assigned

    RAISE NOTICE '✅ Default role permissions assigned';
END $$;

-- =====================================================
-- STEP 12: MIGRATE EXISTING USERS
-- =====================================================
-- Update profiles to use role_id based on their current role string
UPDATE public.profiles p
SET role_id = r.id
FROM public.roles r
WHERE p.role = r.name
  AND p.role_id IS NULL;

-- Set default role for any profiles without a role
UPDATE public.profiles p
SET role_id = (SELECT id FROM public.roles WHERE name = 'student')
WHERE p.role_id IS NULL;

-- =====================================================
-- STEP 13: UPDATE RLS POLICIES FOR MAIN TABLES
-- =====================================================

-- Universities: Use dynamic permissions
DROP POLICY IF EXISTS "Academic managers can do everything on universities" ON public.universities;
DROP POLICY IF EXISTS "Dynamic permission on universities" ON public.universities;
CREATE POLICY "Dynamic permission on universities" ON public.universities
    FOR ALL USING (
        public.has_permission('universities', 'view') OR
        public.has_permission('universities', 'create') OR
        public.has_permission('universities', 'edit') OR
        public.has_permission('universities', 'delete')
    );

-- Programs: Use dynamic permissions
DROP POLICY IF EXISTS "Academic managers can do everything on programs" ON public.programs;
DROP POLICY IF EXISTS "Dynamic permission on programs" ON public.programs;
CREATE POLICY "Dynamic permission on programs" ON public.programs
    FOR ALL USING (
        public.has_permission('programs', 'view') OR
        public.has_permission('programs', 'create') OR
        public.has_permission('programs', 'edit') OR
        public.has_permission('programs', 'delete')
    );

-- Academic Years: Use dynamic permissions
DROP POLICY IF EXISTS "Academic managers can do everything on academic_years" ON public.academic_years;
DROP POLICY IF EXISTS "Dynamic permission on academic_years" ON public.academic_years;
CREATE POLICY "Dynamic permission on academic_years" ON public.academic_years
    FOR ALL USING (
        public.has_permission('academic_years', 'view') OR
        public.has_permission('academic_years', 'create') OR
        public.has_permission('academic_years', 'edit') OR
        public.has_permission('academic_years', 'delete')
    );

-- Intakes: Use dynamic permissions
DROP POLICY IF EXISTS "Academic managers can do everything on intakes" ON public.intakes;
DROP POLICY IF EXISTS "Dynamic permission on intakes" ON public.intakes;
CREATE POLICY "Dynamic permission on intakes" ON public.intakes
    FOR ALL USING (
        public.has_permission('academic_years', 'view') OR
        public.has_permission('academic_years', 'edit')
    );

-- Languages: Use dynamic permissions
DROP POLICY IF EXISTS "Academic managers can do everything on languages" ON public.languages;
DROP POLICY IF EXISTS "Dynamic permission on languages" ON public.languages;
CREATE POLICY "Dynamic permission on languages" ON public.languages
    FOR ALL USING (
        public.has_permission('languages', 'view') OR
        public.has_permission('languages', 'create') OR
        public.has_permission('languages', 'edit') OR
        public.has_permission('languages', 'delete')
    );

-- Leads: Use dynamic permissions
DROP POLICY IF EXISTS "Marketing can manage leads" ON public.leads;
DROP POLICY IF EXISTS "Dynamic permission on leads" ON public.leads;
CREATE POLICY "Dynamic permission on leads" ON public.leads
    FOR ALL USING (
        public.has_permission('leads', 'view') OR
        public.has_permission('leads', 'create') OR
        public.has_permission('leads', 'edit') OR
        public.has_permission('leads', 'delete')
    );

-- Applications (staff view/edit): Use dynamic permissions
DROP POLICY IF EXISTS "Marketing can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Marketing can update applications" ON public.applications;
DROP POLICY IF EXISTS "Staff can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Staff can update applications" ON public.applications;

CREATE POLICY "Staff can view all applications" ON public.applications
    FOR SELECT USING (public.has_permission('applications', 'view'));

CREATE POLICY "Staff can update applications" ON public.applications
    FOR UPDATE USING (public.has_permission('applications', 'edit'));

-- =====================================================
-- STEP 14: VERIFICATION
-- =====================================================
DO $$
DECLARE
    v_roles_count INTEGER;
    v_permissions_count INTEGER;
    v_role_permissions_count INTEGER;
    v_migrated_users INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_roles_count FROM public.roles;
    SELECT COUNT(*) INTO v_permissions_count FROM public.permissions;
    SELECT COUNT(*) INTO v_role_permissions_count FROM public.role_permissions;
    SELECT COUNT(*) INTO v_migrated_users FROM public.profiles WHERE role_id IS NOT NULL;

    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE '✅ DYNAMIC PERMISSION SYSTEM INSTALLED';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Summary:';
    RAISE NOTICE '  - % roles created', v_roles_count;
    RAISE NOTICE '  - % permissions created', v_permissions_count;
    RAISE NOTICE '  - % role-permission assignments', v_role_permissions_count;
    RAISE NOTICE '  - % users migrated to new system', v_migrated_users;
    RAISE NOTICE '';
    RAISE NOTICE 'Default Roles:';
    RAISE NOTICE '  - admin: Full access to everything';
    RAISE NOTICE '  - data_entry: Universities, programs, scholarships';
    RAISE NOTICE '  - marketing: Applications, leads, articles';
    RAISE NOTICE '  - student: Portal access only';
    RAISE NOTICE '';
END $$;

-- Show roles with their permission counts
SELECT 
    r.name AS role_name,
    r.display_name,
    r.is_system,
    COUNT(rp.id) AS permission_count
FROM public.roles r
LEFT JOIN public.role_permissions rp ON rp.role_id = r.id
GROUP BY r.id, r.name, r.display_name, r.is_system
ORDER BY r.name;
