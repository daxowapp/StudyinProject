-- Enable RLS on universities table (if not already enabled)
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- Drop existing public read policy if exists
DROP POLICY IF EXISTS "Allow public read access to universities" ON universities;
DROP POLICY IF EXISTS "Public can view universities" ON universities;
DROP POLICY IF EXISTS "Anyone can view universities" ON universities;

-- Create policy to allow anonymous/public read access to universities
CREATE POLICY "Allow public read access to universities"
ON universities
FOR SELECT
TO anon, authenticated
USING (true);

-- Also enable public access to university_programs table
ALTER TABLE university_programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to university_programs" ON university_programs;

CREATE POLICY "Allow public read access to university_programs"
ON university_programs
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Verify the policies were created
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('universities', 'university_programs');