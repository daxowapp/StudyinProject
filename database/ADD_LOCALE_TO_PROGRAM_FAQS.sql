-- ============================================================
-- ADD LOCALE COLUMN TO PROGRAM_FAQS TABLE
-- ============================================================
-- Adds multi-language support to program FAQs.
-- Existing rows default to 'en'. New unique index ensures
-- no duplicate (program_id, locale, display_order) combos.
-- ============================================================

-- Add locale column (default 'en' so existing rows are preserved)
ALTER TABLE program_faqs ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'en';

-- Drop old unique index on (program_id, display_order)
DROP INDEX IF EXISTS idx_program_faqs_display_order;

-- Create new unique index on (program_id, locale, display_order)
CREATE UNIQUE INDEX IF NOT EXISTS idx_program_faqs_locale_order
    ON program_faqs(program_id, locale, display_order);

-- Index for fast locale-based lookups
CREATE INDEX IF NOT EXISTS idx_program_faqs_locale
    ON program_faqs(program_id, locale);
