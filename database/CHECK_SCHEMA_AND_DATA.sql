-- Check if updated_at column exists and has data
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'applications';

-- Check sample data for updated_at
SELECT id, status, created_at, updated_at 
FROM applications 
ORDER BY created_at DESC 
LIMIT 5;

-- Test the exact query used in the dashboard (without relations first)
SELECT * FROM applications 
ORDER BY updated_at DESC 
LIMIT 5;
