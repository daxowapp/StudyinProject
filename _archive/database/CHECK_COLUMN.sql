-- Check if acceptance_letter_url exists in applications table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'applications' AND column_name = 'acceptance_letter_url';
