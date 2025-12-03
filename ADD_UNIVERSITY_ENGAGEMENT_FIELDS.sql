-- =====================================================
-- ADD UNIVERSITY ENGAGEMENT FIELDS
-- =====================================================
-- This script adds new columns to the universities table
-- to support enhanced engagement features.
-- =====================================================

-- 1. Add brochure_url (for PDF downloads)
ALTER TABLE public.universities 
ADD COLUMN IF NOT EXISTS brochure_url TEXT;

-- 2. Add virtual_tour_url (for 360 tours or videos)
ALTER TABLE public.universities 
ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT;

-- 3. Add schedule_call_url (for Calendly or similar)
ALTER TABLE public.universities 
ADD COLUMN IF NOT EXISTS schedule_call_url TEXT;

-- 4. Add advisor_chat_url (for WhatsApp/Direct chat links)
ALTER TABLE public.universities 
ADD COLUMN IF NOT EXISTS advisor_chat_url TEXT;

-- 5. Comment on columns for clarity
COMMENT ON COLUMN public.universities.brochure_url IS 'URL to the university brochure PDF';
COMMENT ON COLUMN public.universities.virtual_tour_url IS 'URL to a virtual campus tour or video';
COMMENT ON COLUMN public.universities.schedule_call_url IS 'URL to a meeting booking system (e.g. Calendly)';
COMMENT ON COLUMN public.universities.advisor_chat_url IS 'Direct chat link (e.g. WhatsApp) for admissions advisor';
