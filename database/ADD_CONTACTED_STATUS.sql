-- Add "contacted" status to applications pipeline
-- 1. Add contacted_at column
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS contacted_at timestamptz;

-- 2. Drop old status constraint and add new one with 'contacted'
-- The constraint name may vary; drop by finding the existing one
DO $$
DECLARE
  constraint_name text;
BEGIN
  -- Find the check constraint on the status column
  SELECT con.conname INTO constraint_name
  FROM pg_constraint con
  JOIN pg_attribute att ON att.attnum = ANY(con.conkey) AND att.attrelid = con.conrelid
  WHERE con.conrelid = 'public.applications'::regclass
    AND att.attname = 'status'
    AND con.contype = 'c';

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.applications DROP CONSTRAINT %I', constraint_name);
  END IF;
END $$;

-- Add updated constraint with 'contacted' included
ALTER TABLE public.applications
  ADD CONSTRAINT applications_status_check
  CHECK (status IN (
    'draft',
    'submitted',
    'under_review',
    'accepted',
    'rejected',
    'pending_payment',
    'pending_documents',
    'payment_verification',
    'document_verification',
    'withdrawn',
    'contacted'
  ));
