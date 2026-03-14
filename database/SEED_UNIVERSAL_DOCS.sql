-- =====================================================
-- SEED: Universal Document Requirements into admission_requirements_catalog
-- =====================================================
-- These entries allow the application form to reference
-- universal document types with proper UUIDs instead of
-- string IDs like 'univ_passport'.
-- =====================================================

-- Enable uuid-ossp if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert universal documents (Section I - More Notes)
INSERT INTO admission_requirements_catalog (id, title, description, category, requirement_type, is_common)
VALUES
  -- Universal Documents (CUCAS_UNIVERSAL_DOCS)
  ('a0000001-0000-4000-8000-000000000001', 'Passport', 'A clear, full-color scan of your passport information page, showing your name, passport number, expiration date, and photo.', 'universal', 'document', true),
  ('a0000001-0000-4000-8000-000000000002', 'Photo', 'A recent passport-sized ID photo (2 × 2 inches) with a plain white background.', 'universal', 'document', true),
  ('a0000001-0000-4000-8000-000000000003', 'Highest Degree Graduation Certificate', 'A formal graduation certificate of your highest completed education level.', 'universal', 'document', true),
  ('a0000001-0000-4000-8000-000000000004', 'Highest Degree Academic Transcripts', 'Formal academic transcripts of your highest completed education level, covering ALL academic years.', 'universal', 'document', true),
  ('a0000001-0000-4000-8000-000000000005', 'Chinese Language Proficiency Certificate', 'For Chinese Medium Programs. HSK Level 4+ for Bachelor, HSK Level 5+ for Master.', 'universal', 'document', true),
  ('a0000001-0000-4000-8000-000000000006', 'English Language Proficiency Certificate', 'For English Medium Programs. IELTS 6.0+ or TOEFL iBT 90+.', 'universal', 'document', true),
  ('a0000001-0000-4000-8000-000000000007', 'Non-criminal Record Certificate', 'Certificate from local police confirming no criminal record. Valid for 6 months only.', 'universal', 'document', true),
  ('a0000001-0000-4000-8000-000000000008', 'Physical Examination Form', 'Download the form template, print it, and bring it to a hospital for the required medical tests.', 'universal', 'document', true),

  -- China-specific Documents (CUCAS_CHINA_DOCS)
  ('a0000001-0000-4000-8000-000000000009', 'Non-objection Transfer Certificate', 'Issued by your previous Chinese university for transfer students.', 'china_specific', 'document', true),
  ('a0000001-0000-4000-8000-000000000010', 'Entry/Exit Stamps', 'Scanned copies of all passport pages with entry and exit stamps for China.', 'china_specific', 'document', true),
  ('a0000001-0000-4000-8000-000000000011', 'Visa and Residence Permit', 'Scanned copies of all visa pages (X1, X2, T, or others) and residence permit pages.', 'china_specific', 'document', true),
  ('a0000001-0000-4000-8000-000000000012', 'Recommendation Letter From Previous Chinese University', 'Some universities may request a recommendation letter from your previous university.', 'china_specific', 'document', true),

  -- Under-18 Documents (CUCAS_UNDER18_DOCS)
  ('a0000001-0000-4000-8000-000000000013', 'Notarized Guardian Letter of Commitment', 'Students under 18 must find a Chinese guardian in the same city as the university.', 'under_18', 'document', true)

ON CONFLICT (id) DO NOTHING;
