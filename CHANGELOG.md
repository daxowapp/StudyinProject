# Changelog

## [2026-03-13] - Enhancement: Destinations City Images (Batch 7)

- **public/cities/** [NEW × 23]: Generated unique cityscape images for 23 additional cities — Jinhua, Jiaozuo, Cangzhou, Yiwu, Baoji, Zibo, Fuling, Kuala Lumpur, Dezhou, Xiangyang, Dongying, Karamay, Zhanjiang, Linyi, Zhenjiang, Guangyuan, Luoyang, Baoding, Huaiyin, Lianyungang, Daqing, Lishui, Guilin. Total city images now: 99.
- **destinations/page.tsx** [UPDATED]: Added `cityMeta` entries for all 23 new cities plus aliases for compound names (Dongying and Qingdao, Zhenjiang Jiangsu, Jilin City, St Petersburg, Kuala Lumpur).

## [2026-03-13] - Enhancement: Destinations City Images (Batch 4–6)

- **public/cities/** [NEW × 29]: Generated unique cityscape images for 29 additional cities — Wenzhou, Nanchong, Jiamusi, Huangshi, Shantou, Anshan, Mudanjiang, Langfang, Taiyuan, Zhuzhou, Linfen, Wuhu, Jiaxing, Binzhou, Fushun, Huaihua, Jilin, Dali, Shaoxing, Chifeng, Harbin, Dalian, Tianjin, Qingdao, Jinan, Kunming, Shenyang, Zhengzhou, Chongqing. Total city images now: 76.
- **destinations/page.tsx** [UPDATED]: Added `cityMeta` entries for all 29 new cities. Replaced 9 fallback entries (Harbin, Dalian, Tianjin, Jinan, Qingdao, Kunming, Zhengzhou, Shenyang, Chongqing) that previously borrowed other cities' images with their own unique images.

## [2025-07-05] - Enhancement: Dynamic Program Count on Homepage

- **getProgramCount.ts** [NEW]: Lightweight server action that fetches only the total active program count from `v_university_programs_full` — avoids the heavier `getFilterOptions` call on page load.
- **HeroSection.tsx** [UPDATED]: Search button now eagerly fetches the real program count on component mount. Previously showed hardcoded "500+" until a user opened a filter dropdown; now displays the actual database count immediately.

## [2025-07-05] - Redesign: Navbar Glassmorphism Rewrite

- **Navbar.tsx** [REWRITTEN]: Complete rewrite with frosted-glass background (`backdrop-blur-2xl`, `bg-white/70` → `bg-white/95` on scroll), animated underline hover on top-level triggers, icon-tile mega-menu items (48×48 rounded icon containers), decluttered text-only trigger labels (removed inline icons), pill-shaped CTA button with pulsing glow animation, and refined spacing/typography throughout.
- **Navbar.tsx (Mobile)** [REWRITTEN]: Mobile Sheet redesigned with grouped navigation sections, subtle dividers, left-border accent hover on nav items, and pill CTA in auth area.
- **navigation-menu.tsx** [UPDATED]: Viewport dropdown upgraded to `rounded-2xl`, stronger shadow (`shadow-2xl`), and ring border for premium feel.
- **globals.css** [UPDATED]: Added `.nav-underline` animated-width underline utility and `@keyframes nav-glow` pulsing glow animation for the CTA button.

## [2026-03-13] - Enhancement: Navbar Visual Redesign

- **Navbar.tsx** [UPDATED]: Complete visual polish of the navigation bar — smoother scroll transition (`backdrop-blur-2xl`, `shadow-md`), tighter icon sizing (`h-3.5 w-3.5`), gradient CTA button with glow shadow, wider mega-menu panels with upgraded "View All" links (arrow icons, hover-to-primary), and left-border accent hover on all ListItem dropdown items.
- **Navbar.tsx (Mobile)** [UPDATED]: Mobile Sheet drawer redesigned with uppercase section headers (`tracking-wider`), left-border accent hover on all nav items, and gradient CTA button in the auth section.
- **navigation-menu.tsx** [UPDATED]: Viewport dropdown upgraded to `rounded-xl`, `shadow-xl`, and subtle ring border for a more premium appearance.

## [2026-03-13] - Enhancement: QS Rankings Full i18n + University Links

- **qs-rankings-data.ts** [UPDATED]: Added `slug` field to all 72 universities for linking to university detail pages.
- **QSRankingsContent.tsx** [UPDATED]: Refactored to accept `translations` prop for full i18n. University cards and spotlight cards now link to `/universities/[slug]` when a slug is available.
- **page.tsx** [UPDATED]: Integrated `getTranslations` from next-intl for server-side translations of hero section, metadata, and stats.
- **Translations** [NEW]: Added `QSRankings` namespace (meta, hero, content) and `Navbar.resources.qsRankings` keys to `en.json`, `ar.json`, `fa.json`, `tr.json`.
- **Navbar.tsx** [UPDATED]: Replaced hardcoded "QS Rankings 2026" strings with translation keys in both desktop and mobile navigation.

## [2026-03-13] - Enhancement: Footer "Powered by SitConnect"

- **Footer.tsx** [UPDATED]: Added "Powered by SitConnect" with external link to https://sitconnect.net in the footer bottom bar, styled consistently with the existing "Designed by Daxow" credit.

## [2026-03-13] - Feature: QS World University Rankings 2026 Page

- **New Page**: `/qs-rankings` — standalone page showcasing 72 Chinese universities from the QS World University Rankings 2026.
- **qs-rankings-data.ts** [NEW]: TypeScript data file with all 72 ranked universities (rank, name, city, overall score) plus utility functions for tier classification and city extraction.
- **QSRankingsContent.tsx** [NEW]: Interactive client component with search by university name, city dropdown filter, tier-based accordion view (Top 50, 51–200, 201–500, 501+), top-5 spotlight cards with animated gradients, score progress bars, and a CTA section.
- **page.tsx** [NEW]: Server page at `[locale]/qs-rankings` with full SEO metadata, BreadcrumbJsonLd, animated hero section with stats (72 universities, #14 best rank, 5 in top 50, 30 cities), and the interactive rankings component.

## [2025-06-28] - Feature: Destinations Page

- **New Page**: `/destinations` — standalone page showcasing all cities where universities are available, with AI-generated city photography.
- **Hero Section**: Gradient hero with animated orbs, stats (total cities, total universities, top city count), and descriptive copy.
- **Featured Cities**: Top 8 cities by university count displayed as large photo cards with hover animations, university counts, and province labels.
- **All Cities Grid**: Remaining cities in a compact responsive grid (2–6 columns) with smaller photo cards.
- **City Images**: 8 AI-generated images (Beijing, Shanghai, Guangzhou, Wuhan, Hangzhou, Nanjing, Chengdu, Xi'an) saved to `public/cities/`.
- **Translations**: Added `Destinations` namespace to all 9 locales (en, ar, zh, fa, tr, fr, es, ru, tk).
- **Navbar Updated**: "View All Destinations" links now point to `/destinations` instead of `/universities`.

## [2025-06-28] - Feature: Destinations Menu in Navbar

- **Navbar Destinations Dropdown**: Added a new "Destinations" mega-menu dropdown to the desktop navbar with 8 major Chinese cities (Beijing, Shanghai, Guangzhou, Wuhan, Hangzhou, Nanjing, Chengdu, Xi'an). Each city card shows a brief description and links to `/universities?city=CityName` for pre-filtered browsing.
- **Mobile Menu Integration**: Added collapsible Destinations section to the mobile hamburger menu with city links matching the desktop dropdown.
- **URL Param Support**: `UniversitiesClient.tsx` now reads `?city=X` from the URL on mount and auto-selects the corresponding city filter.
- **Translations**: Added full destination translations (title, viewAll, 8 city titles + descriptions) to `en.json`, `ar.json`, and `zh.json`.

## [2025-06-27] - Feature: Interactive University Map & Address Display

- **Interactive Map**: Added Leaflet/OpenStreetMap-powered interactive map to university detail pages, displayed between accommodation and video sections.
- **Address Field**: Added `address` column to universities table with street-level address display on the map.
- **Quick Navigation**: Added 📍 Location quick-jump link in the sticky navigation bar.
- **AI Address Generation**: Updated AI auto-fill prompt to include address. Created dedicated `/api/ai/generate-address` endpoint.
- **Bulk Address Generation**: Created `/api/ai/bulk-generate-address` SSE endpoint to backfill addresses for all existing universities.
- **Admin Form**: Added editable address textarea in the Map Location section of the admin university edit page.
- **Translations**: Added location/map section translation keys for EN, AR, ZH, FA, TK, TR.
- **DB Migration**: Added `supabase/migrations/20250627_add_address_column.sql` for the new address column.

## [2026-03-13] - Feature: Resend Email Integration for Contact Form

- **Email Service Activated**: Contact form submissions now send real emails via Resend API instead of only logging to console.
- **Client Confirmation Email**: After submitting the contact form, the client receives a branded confirmation email with next-steps info and 24-hour response commitment.
- **Admin Notification Email**: Every contact form submission is forwarded to ahmed@sitconnect.net with full details (name, email, phone, subject, message) and a one-click reply button.
- **templates.ts** [UPDATED]: Added `contactConfirmation` and `adminContactNotification` templates using the existing `EmailLayout` design system.
- **service.ts** [UPDATED]: Added `sendContactConfirmationEmail()` and `sendAdminContactNotificationEmail()` functions.
- **actions.ts** [UPDATED]: `submitLead()` now sends both emails in parallel after saving the lead. Email failures are caught gracefully — the lead is always saved.
- **.env.local** [UPDATED]: Added `RESEND_API_KEY`, `ADMIN_EMAIL`, and `EMAIL_FROM` environment variables.

## [2026-03-13] - Fix: Import Routes Excel File Path Update

- **parse/route.ts** [UPDATED]: Changed hardcoded Excel path from `data/imacpart2.xlsx` to `supabase/combined_data_2026-03-0.xlsx` to match new data file with correct column structure (includes `Source_File` column at index 0).
- **programs/route.ts** [UPDATED]: Changed Excel path from `supabase/combined_data_2026-03-09.xlsx` to `supabase/combined_data_2026-03-0.xlsx`.
- **backfill-requirements/route.ts** [UPDATED]: Changed Excel path from `data/imacpart2.xlsx` to `supabase/combined_data_2026-03-0.xlsx`.
- **data-import/page.tsx** [UPDATED]: Updated displayed filename in admin UI.

## [2026-03-14] - Feature: University FAQ Generator (AI-Powered)

- **database/CREATE_UNIVERSITY_FAQS_TABLE.sql** [NEW]: Migration script creating `university_faqs` table with composite unique key `(university_id, locale, display_order)` and `cascade_delete` on university removal.
- **generate-university-faqs/route.ts** [NEW]: API route that generates 8 FAQ Q&A pairs for a single university using OpenAI. Accepts `universityId`, `locale`, and `overwrite` params. Upserts with conflict handling.
- **bulk-generate-university-faqs/route.ts** [NEW]: SSE streaming API route for bulk university FAQ generation across multiple locales. Supports resume/overwrite modes and abort signal.
- **faq-generator/page.tsx** [UPDATED]: Refactored into tabbed interface ("Program FAQs" / "University FAQs") with shared `useSSEGenerator` hook to eliminate ~200 lines of duplicated SSE logic. Both tabs share the same UI pattern: coverage stats, language selection, progress bar, and activity log.
- **universities/[slug]/page.tsx** [UPDATED]: Fetches `university_faqs` table filtered by locale, passes FAQs to `UniversityContent`, and renders `FAQJsonLd` structured data for SEO.
- **UniversityContent.tsx** [UPDATED]: Added FAQ accordion section using `<details>/<summary>` with numbered items, chevron animation, and hover effects.
- **messages/en.json** [UPDATED]: Added `UniversityDetail.faq.title` translation key.

## [2026-03-13] - Fix: Reliable University Media Import (Rewrite)

- **bulk-media-import/route.ts** [REWRITTEN]: Complete rewrite for accuracy. **Removed** unreliable third-party APIs (Clearbit, Google Favicon, DuckDuckGo) that returned wrong logos for Chinese universities. **New approach**: Scrapes the university's own website HTML directly to extract logos from `<link rel="apple-touch-icon">`, favicon `<link>` tags, and `<img>` elements with logo-related attributes. Cover photos extracted from `og:image`, `twitter:image`, hero/banner images, and CSS background images. Single scrape per university reused for both logo and cover. Wikipedia and Wikimedia Commons kept as fallback only. Safety guards: minimum file sizes, content-type validation, SVG rejection.
- **BulkMediaImportButton.tsx** [UNCHANGED]: Admin dialog component with progress bar, live log, and logo/cover stats.
- **universities/page.tsx** [UNCHANGED]: "Import Media" button in admin universities page header.


## [2026-03-12] - Performance: Universities Page Query Optimization

- **Database View** [NEW]: Created `v_universities_listing` Postgres view (`database/create_universities_listing_view.sql`) that pre-aggregates program data per university — program count, min tuition, available levels/languages, scholarship and CSCA flags. Eliminates expensive N×M row fetching.
- **page.tsx**: Replaced nested Supabase query (universities → university_programs → program_catalog + languages) with a flat `SELECT *` from the new view. Removed ~40 lines of JS aggregation logic.
- **UniversityCard.tsx**: Wrapped component with `React.memo()` to prevent re-renders on filter/sort changes. Added `sizes` and `loading="lazy"` props to all `<Image>` components for proper responsive image sizing.

## [2025-08-01] - Feature: Multi-Language FAQ Generator Admin Page

- **faq-generator/page.tsx** [NEW]: Dedicated admin page at `/admin/faq-generator` for AI FAQ generation. Supports 9 languages (en, tr, ar, fa, tk, zh, fr, es, ru) with coverage stats dashboard, language checkboxes, overwrite/resume modes, progress bar, streaming activity log, and abort button.
- **generate-faqs/route.ts** [UPDATED]: Now accepts `locale` parameter to generate FAQ Q&A in the target language. Uses language-specific prompts. Upserts with `(program_id, locale, display_order)` composite key.
- **bulk-generate-faqs/route.ts** [UPDATED]: Accepts `locales[]` array for multi-language bulk generation. Loops through each selected locale, skips programs that already have FAQs in that locale (resume mode), or overwrites if requested.
- **program_faqs table** [MIGRATION]: Added `locale` column (default `'en'`) to support per-language FAQ storage.
- **programs/[slug]/page.tsx** [UPDATED]: Program detail page now filters FAQs by the current page locale, showing language-appropriate FAQ content.
- **Sidebar.tsx** [UPDATED]: Added "FAQ Generator" link under Tools sidebar group.
- **data-import/page.tsx** [UPDATED]: Replaced inline FAQ generation card with redirect link to the dedicated FAQ Generator page. Removed unused FAQ state variables and handler function.

## [2025-08-01] - Feature: AI-Powered Program FAQ Generation

- **program_faqs table** [NEW]: Database migration (`CREATE_PROGRAM_FAQS_TABLE.sql`) creates a `program_faqs` table storing AI-generated Q&A pairs per program with `display_order` and timestamps.
- **generate-faqs/route.ts** [NEW]: API route that generates 10 SEO/GEO/AEO-optimized FAQ Q&A pairs for a single program using OpenAI gpt-4o-mini. Covers tuition, admission, scholarships, career prospects, campus life, visa, accommodation, and more.
- **bulk-generate-faqs/route.ts** [NEW]: Bulk API route with SSE streaming that iterates all programs and generates FAQs for each. Supports `overwrite` mode. Reports real-time progress (processed, generated, errors).
- **data-import/page.tsx**: Added "Generate Program FAQs" card (purple theme) to admin Data Import page with overwrite checkbox, progress bar, and log integration.
- **programs/[slug]/page.tsx**: Program detail page now fetches dynamic FAQs from `program_faqs` table. Falls back to hardcoded i18n FAQs when no generated FAQs exist. JSON-LD FAQPage schema uses dynamic data.

## [2025-08-01] - Feature: Bulk AI Auto-fill for All Universities

- **generate/route.ts** [NEW]: Created the missing `/api/ai/generate` route. Handles single university, program, and translation AI generation requests via OpenAI gpt-4o-mini.
- **bulk-autofill/route.ts** [NEW]: New API route that fetches all universities, generates AI data for those missing key fields (description, founded, ranking, coordinates, etc.), and saves directly to the database. Uses SSE for real-time progress. Only fills empty fields — never overwrites existing data.
- **BulkAutofillButton.tsx** [NEW]: Client component with dialog UI showing real-time progress bar, log output, and statistics during bulk autofill.
- **universities/page.tsx**: Added "Bulk Auto-fill All" button to the universities list page header.

## [2025-08-01] - Fix: Incomplete Universities Import — Skip Existing, Add Only Missing

- **programs/route.ts**: Fixed three critical bugs in the import:
  1. **Catalog lookup truncation**: `program_catalog` fetch was also hitting Supabase's 1000-row limit, making `catalogLookup` incomplete. Existing programs couldn't be matched, so skip-existing filter didn't work. Now paginates all catalog entries.
  2. **Fallback `.single()` crash**: When catalog insert fails (duplicate key), the recovery query used `.single()` which throws when multiple rows match `ilike`. Changed to `.limit(1)` with array access. Also updates `catalogLookup` after recovery.
  3. **DB program count truncation**: `university_programs` count query also paginated to avoid 1000-row limit. Added minimum threshold of 5 missing programs (DB=0 always reimports).
- **data-import/page.tsx**: Added `info` SSE event handling for pagination progress messages.

## [2026-03-12] - Feature: Program Language Filter on University Page

- **UniversityContent.tsx**: Added a language filter row (green-accent pills) below the existing level tabs in the Programs section. Programs can now be filtered by both level and language simultaneously. The language row only appears when two or more distinct languages exist.
- **Translations**: Added `allLanguages` and `filterByLanguage` keys to en, ar, fa, tr, zh, tk locale files.

## [2026-03-12] - Fix: Standardized Program Level Casing

- **normalize-levels.ts**: Fixed script to target `program_catalog` table instead of `university_programs` (which doesn't have a `level` column). Ran normalization — updated 53 entries (e.g. `bachelor` → `Bachelor`) across 5,878 catalog entries.
- **Affected**: Programs that appeared under separate "Bachelor" and "bachelor" tabs are now unified under "Bachelor".

## [2025-07-31] - Fix: Inverted CSCA Filter Logic

- **ProgramsClientContent.tsx**: CSCA filter now hides programs that require CSCA when toggled on (previously it showed only CSCA-required programs). Updated active filter chip label to "No CSCA".
- **UniversitiesClient.tsx**: Same inversion — toggling CSCA filter now hides universities with CSCA exam requirement.
- **UniversityFilters.tsx**: Updated label to "No CSCA Exam Required" and description to "Show programs without CSCA".
- **en.json**: Updated `cscaLabel`, `cscaDesc`, and `cscaBadge` translation strings to reflect inverted behavior.

## [2025-07-30] - Feature: Bulk Fix All Entry Requirements (DB Only)

- **bulk-fix-requirements/route.ts** [NEW]: New API route that scans all programs directly from the database and rewrites raw entry requirements via AI (OpenAI gpt-4o-mini). No Excel file needed. Includes resume support and force-all option.
- **data-import/page.tsx**: Replaced single Fix Entry Requirements card with two side-by-side cards: "Fix Requirements (Excel)" for the original Excel-based backfill, and "Fix All Requirements (DB)" for the new DB-only bulk fix. New card includes force-all checkbox and real-time progress bar with fixed/skipped/error counters.

## [2025-07-29] - Performance Fix: Universities Page Search

- **UniversityHeroSearch.tsx**: Eliminated `router.replace()` on every keystroke. Search now uses client-side state with 250ms debounce. Added spinner icon during debounce.
- **UniversitiesClient.tsx**: Added debounced search state (`debouncedSearch` / `isSearching`), "Searching…" overlay, and `heroSearchQuery` prop for receiving hero search queries.
- **UniversityFilters.tsx**: Added `isSearching` prop with animated spinner icon in sidebar search input.
- **UniversitiesPageClient.tsx** [NEW]: Wrapper client component bridging hero search and university list via shared React state — no server round-trips.
- **page.tsx**: Replaced separate `UniversityHeroSearch` + `UniversitiesClient` with unified `UniversitiesPageClient` wrapper.
- **Translations**: Added `search.searching` key to all 9 locale files (en, ar, fa, tr, zh, es, fr, ru, tk).

## [2025-07-28] - Feature: Apply Form Step 1 Sub-Step Wizard

- **formConfig.ts**: Added `SubStepDef` type and `getSubStepSections()` — level-aware sub-step definitions (Identity → Contact → Address → Education → Language → Emergency; Non-Degree gets only Identity + Contact).
- **ApplyFormSteps.tsx**: Added `SubStepIndicator` (compact dot progress) and `subStepLabel` prop to `StepNavigation`.
- **ApplyForm.tsx**: Refactored Step 1 from a single long scrollable form into a multi-sub-step wizard with animated transitions, per-section validation, scroll-to-top on change, and Back/Next navigation within sub-steps.

## [2025-07-28] - Fix: Admin Panel Document Request CUCAS Sync

- **ApplicationDialog.tsx**: Replaced flat 10-item `commonDocuments` array with CUCAS-categorized `documentSections` (Universal 8, China Transfer 4, Under-18 1) imported from `ApplyFormSteps.tsx`. Required docs now show a red asterisk.
- **ApplicationManagementForm.tsx**: Same categorized sync — admin document request tab now matches the student upload flow.

## [2025-07-28] - Feature: Full CUCAS Document Sections & Upload Enhancements

- **DocumentNoticePanel**: Updated to show 6 official CUCAS upload rules (formats, file size ≤5MB, passport photo specs, scan quality, Chinese/English translation requirements, notarization).
- **ConditionalDocumentSection**: Redesigned with inverted-checkbox pattern ("check to skip this section"), numbered section headers (I, II, III), and section headings.
- **ServiceBanner**: New two-column banner linking to CUCAS Accommodation Service and CUCAS Airport Pickup Service.
- **Universal Documents (Section I)**: 8 CUCAS-standard document slots — Passport Info, Personal Photo, Graduation Certificate, Transcripts, Chinese Proficiency, English Proficiency, Physical Exam, Non-criminal Record.
- **China Transfer Documents (Section II)**: 4 conditional document slots for students currently in China — Previous Chinese Visa, Transfer Certificate, Study Certificate, Registration Form.
- **Under-18 Documents (Section III)**: 1 conditional document slot — Guardian Letter with Notarized ID.
- **Upload Zone**: Updated accepted formats to RAR, PDF, JPG, PNG, GIF, DOC, DOCX with 5MB limit.
- **ApplyForm.tsx**: Integrated ServiceBanner, CUCAS_UNIVERSAL_DOCS Section I, CUCAS_CHINA_DOCS Section II, CUCAS_UNDER18_DOCS Section III.

## [2025-07-28] - Feature: Horizontal Progress Stepper & CUCAS Document Upload

- **ProgressTopBar**: Replaced sidebar + mobile bar with a unified horizontal stepper at the top of the form, showing program name, logo, step icons with connectors, and progress percentage.
- **DocumentUploadZone Enhancement**: Added CUCAS-style orange gradient ribbon header to each upload card with document title and Required/Optional/Done badges. Green ribbon when complete.
- **DocumentNoticePanel**: Added a notice panel in Step 2 with upload guidelines (file format, size, scan quality tips).
- **ConditionalDocumentSection**: Added collapsible checkbox-triggered sections for conditional documents (e.g. "Have you studied in China before?", "Are you under 18?").
- **Layout**: Changed from `max-w-6xl` two-column layout to `max-w-4xl` single-column layout for a cleaner, centered form.
- **Section Headers**: Required/Optional document groups now use numbered Roman numeral badges (I, II) with upload counters.
- **Removed**: `ProgressSidebar` and `MobileProgressBar` components (no longer exported/used).

## [2025-07-28] - Feature: Level-Aware Smart Application Form

- **New Module**: `formConfig.ts` — centralised level-aware configuration defining which sections/fields are visible for each program level (Bachelor, Master, PhD, Non-Degree).
- **Minimal Non-Degree Form**: Non-Degree programs now show only Identity and Contact sections, skipping Address, Education, Language, and Emergency Contact for a faster application experience.
- **Config-Driven Validation**: `getMissingFields()` now uses `getRequiredFields(programLevel)` instead of a hardcoded list — validation adapts automatically to the visible form.
- **Review Step Adapted**: The final review step conditionally renders only sections/fields that were visible during input.
- **Helper Functions**: `normalizeLevel()`, `getVisibleSections()`, `isSectionVisible()`, `isFieldVisible()`, `getRequiredFields()` — all exported for reuse.

## [2025-07-28] - Feature: CUCAS-Style ApplyForm Overhaul

- **New Components**: Added `SmartSelect`, `DateField`, and `TextAreaField` reusable components to `ApplyFormSteps.tsx`.
- **Expanded Step 1**: Reorganized personal info into 5 collapsible sections — Identity, Contact/Address, Education Background, Language Proficiency, and Emergency Contact.
- **New Fields**: Added `first_name`, `last_name`, `gender`, `date_of_birth`, `religion`, `marital_status`, `wechat_id`, `address`, `city`, `postal_code`, `highest_education`, `school_name`, `major_field`, `graduation_year`, `gpa_score`, `chinese_proficiency`, `english_proficiency`, `test_score`.
- **Review Step**: Expanded to show all new fields organized by section with proper i18n labels.
- **handleSubmit**: Updated to include all new fields in Supabase profile upsert and application metadata.
- **i18n**: Added full translation keys (sections, options, labels, placeholders) to `en.json`, `ar.json`, and `zh.json`.

## [2025-07-28] - Fix: Tailwind v4 Class Name Warnings

- **Gradient Classes**: Replaced all `bg-gradient-to-*` with `bg-linear-to-*` across `ApplyForm.tsx`, `ApplyFormSteps.tsx`, `UniversityCard.tsx`, `HeroSection.tsx` (19 instances).
- **Shorthand Classes**: `min-h-[2.75rem]` → `min-h-11`, `min-h-[1.75rem]` → `min-h-7`, `bg-[size:...]` → `bg-size-[...]`, radial-gradient spacing fix.
- **Unused Imports**: Removed 7 unused lucide-react icons and 2 unused variables in `ApplyFormSteps.tsx`.

## [2025-07-28] - Redesign: ApplyForm Glassmorphism UI

- **New Component**: `ApplyFormSteps.tsx` — reusable sub-components (GlassCard, SectionHeader, SmartField, PhoneField, CountrySelect, IntakeSelect, DocumentUploadZone, ProgressSidebar, MobileProgressBar, ReviewSection, ReviewField, StepNavigation, SuccessConfetti).
- **ApplyForm Redesign**: Replaced inline render code with glassmorphism-styled components. Added frosted-glass cards, gradient progress sidebar, animated confetti success screen, and mobile-responsive progress bar.
- **Code Cleanup**: Removed ~630 lines of duplicated old render code, cleaned unused imports (Card, Alert, Select, Input, Label, Building2, GraduationCap, COUNTRIES).
- **TypeScript**: Verified compilation passes with zero errors.

## [2026-03-12] - Feature: Backfill Entry Requirements for Old Programs

- **New API Endpoint**: `/api/import/backfill-requirements` — reads raw entry requirements from Excel, AI-rewrites them, and updates DB programs.
- **Admin UI**: Added "Fix Entry Requirements" card to the Data Import page with resume support.
- **Auto-Detection**: Identifies programs needing fix (NULL, raw dashes, semicolons without bullet points).

## [2026-03-12] - Bug Fix: Import Resume Skipping All Universities

- **Fuzzy Resume Matching**: Resume now uses `includes` matching instead of exact string equality — partial university names work.
- **Accurate Counts**: Skipped-by-resume programs no longer inflate the `created` count.
- **Resume-Not-Found Warning**: If the resume point doesn't match any university, a clear `⚠️` warning is shown instead of silently skipping everything.

## [2026-03-12] - Fix: Entry Requirements Not Showing on Program Page

- **View Migration**: Added `entry_requirements` and `has_custom_requirements` columns to `v_university_programs_full` view — previously missing, causing the program detail page to render an empty card.
- **SQL**: `database/FIX_VIEW_ADD_ENTRY_REQUIREMENTS.sql` — drops and recreates both `v_university_programs_full` and `v_scholarship_programs` views.

## [2026-03-12] - Refactor: Simplified Entry Requirements (Text-Based)

- **Per-Program Entry Requirements**: Raw `entry_requirements` text from Excel is now AI-rewritten (GPT-4o-mini) into clean bullet-point format and stored directly on each program record as a `text` column.
- **Removed Catalog Matching**: Eliminated the complex `generateRequirementsMapping` function and `admission_requirements_catalog` lookup — entry requirements are now a simple text field, not structured catalog references.
- **Fallback Display**: The `ProgramRequirements` component shows the AI-cleaned text when no structured university-level requirements are assigned.
- **Description Backfill**: Existing `program_catalog` entries with null descriptions are still automatically backfilled with AI-generated descriptions during import.
- **Description Fallback**: If AI returns no description, a template-based description is used instead of null.

## [2025-07-25] - Feature: Anti-Scraping Protection

- **Rate Limiting Middleware**: Added in-memory rate limiter to `middleware.ts` — 60 req/min for pages, 30 req/min for `/api` routes. Returns `429 Too Many Requests` with `Retry-After` and `X-RateLimit-*` headers.
- **Bot Blocking**: Known scraper User-Agents (Scrapy, python-requests, curl, wget, HTTrack, etc.) are immediately blocked with `403 Forbidden`.
- **AI Bot Whitelist**: Search and AI answer engine bots (Googlebot, GPTBot, PerplexityBot, ClaudeBot, ChatGPT-User, Google-Extended, Amazonbot) are explicitly whitelisted and never rate-limited — preserving GEO/AEO.
- **robots.txt Updated**: Blocked SEO tool scrapers (AhrefsBot, SemrushBot, MJ12bot, DotBot, BLEXBot, Bytespider, DataForSeoBot). Added explicit allow rules for AI answer engine bots.
- **New File**: `src/lib/rate-limit.ts` — sliding window rate limiter with auto-cleanup of stale entries.

## [2025-07-25] - Bug Fix: Programs Page Showing Only 997 Programs

- **Supabase Pagination**: Added paginated fetching loop in `programs/page.tsx` to bypass Supabase's default 1000-row limit. Now fetches all programs in batches of 1000.

## [2025-07-25] - Enhancement: i18n Hardcoded String Replacement

- **HeroSection.tsx**: Replaced 16 hardcoded English strings (budget ranges, scholarship options, duration options, browse-by-category labels) with `t()` translation calls using `Home` namespace.
- **ProgramsClientContent.tsx**: Replaced 12 hardcoded strings (Quick Access header, quick chip labels, AI search messages, level labels map, field/scholarship/CSCA badges, loading state text) with `t()` calls using `Programs` namespace.
- **ProgramFilters.tsx**: Replaced 8 hardcoded strings (Scholarship Available/desc, CSCA label/desc, Academic Requirements header, My Age/Min GPA labels, placeholders) with `t()` calls.
- **en.json**: All required i18n keys already present under `Home` and `Programs` namespaces.

## [2025-07-25] - Enhancement: Universities Page Full Feature Upgrade

- **Bug Fix - Canonical URLs**: Removed accidental space before `/` in `generateMetadata` that broke canonical and alternate links.
- **Bug Fix - SEO H1**: Changed `<h2>` to `<h1>` for the main page title to improve heading hierarchy.
- **Sort Dropdown**: Wired up the sort dropdown with 6 options — Name A-Z, Most Programs, City, Tuition Low→High, Tuition High→Low, and Best Ranking.
- **Active Filter Chips**: Added a horizontal chip bar above results showing active search query, city, type, category, ranking, and feature filters with individual remove buttons.
- **Skeleton Loading**: "Show More" now shows animated skeleton cards (matching grid/list layout) while loading.
- **Compare Universities**: Added compare feature — users can select 2-3 universities and compare them in a side-by-side dialog with location, ranking, programs, tuition, study levels, languages, scholarships, fast track, and accreditations.
- **Compare Button on Cards**: Both grid and list card variants now have a compare toggle button (GitCompareArrows icon).
- **Translations**: Added EN/AR keys for sort options (`tuitionLow`, `tuitionHigh`, `ranking`), results section (`showMore`, `showingOf`), compare dialog, and card compare button labels.
- **Hardcoded Text Fix**: Replaced hardcoded "Show More" and progress text with translated strings using `{count}`, `{visible}`, `{total}` placeholders.

## [2025-07-24] - Enhancement: University Card Premium Visual Redesign

- **Grid Card Redesign**: Hero banner with gradient overlays, floating logo with ring effect, hover translate animation, and improved layout hierarchy.
- **List Card Redesign**: Responsive horizontal layout with photo/logo section, feature pills, stat boxes, and action buttons.
- **New Feature Pills**: Cards now display scholarship availability (emerald badge), available study levels, available languages, and fast-track status.
- **Micro-Interactions**: Hover scale on photos, translate-y on cards, arrow slide on CTA buttons, smooth color transitions on links.
- **Translation Keys**: Added `fastTrack`, `scholarship`, `contactForPricing` keys to both `en.json` and `ar.json`.
- **Data Fields**: Card interface now supports `has_fast_track`, `availableLevels`, `availableLanguages`, `hasScholarship`, `hasCscaExam`.

## [2025-07-24] - Feature: Program-Level Filters on Universities Page

- **University Filters Enhanced**: Added scholarship toggle, CSCA exam toggle, study level checkboxes (Bachelor/Master/PhD), tuition range slider, and language filter (English/Chinese) to the universities page — matching the programs page filter capabilities.
- **Server Query Expanded**: The universities page now fetches `level`, `language_name`, `scholarship_chance`, and `csca_exam_require` from `university_programs` and aggregates them per university.
- **UX Improvement**: Reorganized existing filters (city, institution type, university category) into collapsible accordions for cleaner sidebar layout.
- **Filter Logic**: Universities are filtered based on whether any of their programs match the selected criteria (levels, languages, tuition cap, scholarship availability, CSCA exam requirement).
- **Bug Fix**: Fixed Supabase query using nested relations `program_catalog(level)` and `languages(name)` instead of selecting non-existent columns directly from `university_programs`.

## [2026-03-11] - Fix: Programs View Missing Columns + Import Dedup

- **Critical Bug Fix (DB View)**: `v_university_programs_full` view was missing `gpa_requirement`, `application_deadline`, `score_ielts`, `score_toefl`, `score_duolingo` columns. Data was correctly saved to `university_programs` table but invisible to the frontend. Created `FIX_VIEW_ADD_SCORES_AND_DEADLINE.sql` migration.
- **Import Dedup Fix**: Replaced delete-all with safe upsert — existing programs are updated in place, new ones are inserted. No data loss if import is interrupted.
- **Resume Import**: Added "Resume from university" input to the data-import page. When set, skips all universities before the specified one, continuing from where the last import left off.
- **Universities Page Pagination**: Replaced `.limit(100)` with progressive rendering. Shows 24 universities initially, with a "Show More" button + progress bar. Filters/search remain instant. Loads up to 1000 universities total.

## [2025-07-23] - Fix: Programs Import Route (Critical)

- **Bug Fix**: Rewrote `/api/import/programs` route — was inserting into a legacy `programs` table instead of the correct `program_catalog` + `university_programs` tables. Imported programs now appear in the admin panel.
- **Import Route**: Programs are now inserted via: (1) find-or-create `program_catalog` entry, (2) resolve `language_id` from the `languages` table, (3) insert into `university_programs` with `portal_key`, matching the `createProgram` server action.
- **Import Route**: Added automatic category inference for catalog entries based on program title keywords.
- **AI Enrichment**: The import now uses OpenAI to fill ALL form fields missing from the Excel spreadsheet: GPA requirement, IELTS/TOEFL/Duolingo scores, scholarship chance, duration (fallback), and intake (fallback). Chinese-taught programs correctly get null language scores.
- **Entry Requirements Parsing**: Added regex parser that extracts GPA, IELTS, TOEFL, Duolingo, and HSK scores from the `entry_requirements` free-text column. Parsed data takes priority over AI-generated values.
- **GPA Always Filled**: AI now always provides a GPA requirement regardless of teaching language (Chinese or English).
- **Application Deadline AI Fill**: AI now generates realistic application deadlines (YYYY-MM-DD) as fallback when Excel data is missing. Typical deadlines: Jun 15–Jul 31 for Fall 2026 intake.
- **Upsert on Re-run**: Re-importing programs now **updates** existing entries instead of skipping them. New programs are inserted; existing ones get refreshed data (GPA, deadline, scores, fees).
- **Auto-Dedup Cleanup**: Before importing, automatically removes duplicate `university_programs` rows (keeps newest) from previous faulty imports.
- **AI Debug Logging**: Added console.log for AI responses to trace why fields might be empty — logs AI keys, sample data, fuzzy match attempts, and final insert values.

## [2026-03-11] - Admin Data Import System

- **Admin UI**: Built a new `/admin/data-import` page with a 3-step wizard for importing universities and programs from Excel spreadsheets.
- **API**: Created `/api/import/parse` to read Excel files, extract unique universities, and detect which already exist in the database.
- **API**: Created `/api/import/universities` with SSE streaming — imports new universities one-by-one, enriches each with OpenAI-generated descriptions, logos, and cover images. Skips universities that already exist.
- **API**: Created `/api/import/programs` with SSE streaming — batch-imports programs, generates SEO-friendly slugs, maps to universities, and auto-generates AI descriptions. Skips programs that already exist (matched by slug + university).
- **Admin Sidebar**: Added "Data Import" link under the Settings section of the admin sidebar navigation.
- **Config**: Added `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` for admin-level database operations (bypasses RLS).
- **Config**: All import API routes use `createAdminClient()` with the service role key.

## [2026-03-11] - Database Seeding

- **Backend**: Created python scripts to continuously generate random placeholder universities and programs to test search logic seamlessly.\

## [2026-03-11] - Automated Database Population & Integration

- **Backend**: Implemented `import_csvs.py` to continuously process universities and programs from extracted CSCA Excel spreadsheets. Features parallel processing, AI-powered description generation via OpenAI, image integration, and incremental UPSERT logic.

## [2026-03-10] - CSCA Guide Update

- **Content**: Updated the `/articles/csca-guide` page and translations with comprehensive curriculum details, formatting, dates, fees, and requirements extracted from the official CUCAS source, branded for Study at China.

## [2026-03-10] - Program Detail UI Upgrade

- **Public UI**: Redesigned the Program Detail page layout for a premium SaaS look. Restyled the hero section with gradient backgrounds, elevated typography, and a clearer presentation of key tags.
- **Public UI**: Replaced the monolithic "Key Facts" list with individual, glassphormic KPI cards for faster scanning.
- **Public UI**: Upgraded the right-hand sidebar with modern drop shadows, gradients, and polished calls to action.

## [2026-03-10] - CSCA Exam Requirement Toggle

- **Public UI**: The CSCA Exam filters are integrated into the main "Programs" directory listing and the specific "Scholarships" directory with active sidebars parsing the state from URLs. Rendered a "📝 Requires CSCA" badge conditionally across all programmatic program cards on the application (university, lists, sub-pages).

## [2026-02-26] - Smart Search Ranking Fix

- **Search Ranking**: Fixed smart search result ordering so exact program matches appear first, followed by related programs. Searching "biomedical engineering" now shows Biomedical Engineering programs at the top, with MBBS/Nursing/etc. below.
- **List View**: Implemented functional grid/list toggle on both Programs and Universities pages. List view shows compact horizontal card layouts for faster scanning, set as the default view.

## [2026-02-25] - Added Google Analytics

- **Analytics**: Added Google Analytics gtag.js tracking script to the main application layout (`src/app/[locale]/layout.tsx`).

## [2026-02-20] - Consolidated Service Fee & Standardized Applications

- **Scholarship Disclaimer**: Injected a visual disclaimer across all scholarship components (`/scholarships`, individual program pages, and university pages) clarifying that continuation depends on academic performance.
- **Database Standardization**: Automatically updated all existing `university_programs` to have a flat $300 Application Fee.
- **Search Filters**: Enabled 'My Age' and 'Min GPA' academic filters in the Program Search view, utilizing native `university_programs` columns (`min_age`, `max_age`, `gpa_requirement`) to drop mutually exclusive programs.
- **Frontend Override**: Fixed a bug where application fees would improperly convert through exchange rates by explicitly setting their currency code to `USD` across the checkout and program pages.
- **Fee Structure**: Removed general program `service_fee` and merged its value into `application_fee` to simplify payment structures.
- **UI Updates**: Removed "Service Fee" items from all program detail pages, checkout forms, and application summary cards.
- **Admin**: Removed the separate service fee from Program management.
- **Note**: Scholarship-specific service fees remain unaffected.

## [2026-01-20] - Home Page Search & Typo Handling

- **Typo Tolerance**: Integrated AI-powered search expansion to handle misspellings (e.g., "mangmnet" → "Management").
- [2026-01-20] - AI Search - Fixed cross-language search by enforcing English output (e.g., Arabic "كمبيوتر" -> English "Computer Science") to match database records.
- [2026-01-20] - Translations - Added missing `Hero.searchPlaceholder` translation to ar, tr, zh, es, fr, ru, fa, tk.
- [2026-01-20] - UX - Implemented AI Search Loading State to prevent '0 results' flash. during search expansion.
- **Home Page Integration**: Added functional search bar to Hero section.
- **Bug Fix**: Resolved critical issue where search updates were cached/stale by refactoring program list component structure.

## [2026-01-19] - AI Search Typo Correction

- AI search now handles typos and misspellings (e.g., "softwore" → "Software Engineering", "medcine" → "Medicine")
- Improved prompt engineering for better academic term recognition

## [2026-01-19] - Active Filters Display Fix

- Fixed bug where clicking a degree level (e.g., Bachelor) showed multiple duplicate filter badges
- Active filters now display a single, removable badge per degree type
- Added proper labels and graduation cap emoji to degree filter badges
- Users can now remove individual degree filters by clicking the X button

## [2026-01-19] - Program Search Fixes

- Fixed "Missing Programs" issue where only a subset of Bachelor programs were shown
- Removed internal query limit (200) that was truncating search results
- Now fetching all active programs (800+) to ensure accurate client-side filtering
- Fixed search input focus issue where input lost focus after every character (removed inline component definition)
- Fixed active filter deletion (X button) not working by enabling pointer events on the icon

- Fixed active filter deletion (X button) not working by enabling pointer events on the icon

## [2026-01-19] - Quick Access Search

- Added "Quick Access" chip filters above program list for instant search
- Users can now one-click filter for popular majors: 💻 Computer Science, 💼 Business, 🏗️ Engineering, 🏥 Medicine, 🎨 Arts, 📊 Economics

## [2026-01-19] - AI-Powered Smart Search

- Implemented **AI-Powered Search Expansion** using OpenAI (gpt-4o-mini)
- Added **Home Page Search Bar** for direct access to programs
- Searching for vague terms (e.g., "Build houses") now automatically finds related academic fields (Civil Engineering, Architecture, etc.)
- Added "AI Thinking" visual indicator during search
- Implemented debouncing to optimize API usage
- Fixed bug where filtered terms like "computer" matched unrelated programs
- Fixed URL search parameter initialization logic
- **Search Logic Refined**: Search now strictly matches program names, preventing university names (e.g., "Medical University") from poluting results for queries like "Medicine".
- **Home Page Search**: Added search bar to Hero section for direct program discovery.

## [2026-01-18] - Translation Fixes

- Added missing `UniversityScholarships` translations (`scholarshipType`, `action`) for English, Turkish, and Arabic.

## [2026-01-15] - Program Menu Filtering & Translations Fix

- Fixed program level filtering from navbar menu (clicking Bachelor/Master/PhD now correctly filters programs)
- Changed "Non-Degree" menu item to "Chinese Courses" across all 9 languages
- Added handling for both `level` (navbar) and `degree` (hero search) URL parameters

## [2026-01-15] - CSCA Exam 2026 Update

- Added new FAQ about 2026 intake exception: certificate of participation can be sufficient for some universities
- Students can apply with proof of exam participation even without high scores during the transition period

## [2026-01-15] - Scholarship Section Redesign & Apply Button Fix

- Redesigned scholarship section with premium table-like row layout
- Shows all information: type, coverage %, service fees (USD + CNY), benefits with icons
- Apply Now button now scrolls to programs section on university page (no redirect)
- Direct apply only when viewing a specific program

## [2026-01-15] - Language Scores & Scholarship Display - Added IELTS, TOEFL, Duolingo score fields to programs; Fixed scholarship benefits display truncation.

[2026-01-15] - Program Deployment Fix - Resolved build error by adding `application_deadline` to Program type.

## [2026-01-15] - Minimum GPA Requirement Field

- Added customizable GPA requirement field to admin program dialog
- Admins can now enter any minimum GPA value (e.g., 2.0, 2.5, 3.0) per program
- GPA displayed in Key Facts card on program detail page when set
- Added translations for "Minimum GPA" label in all 9 languages (EN, AR, TR, FA, ZH, TK, ES, FR, RU)

## [2026-01-15] - Tuition Display Bug Fix

- Fixed "Contact for pricing" always showing on universities page
- Updated query to fetch actual tuition fees from programs
- Universities now display real minimum tuition prices (e.g., ¥22,000 CNY)

[2026-01-14] - Fixed Program Deadline - Fixed issue where program application deadline was not saving by adding missing column to database view. Also added countdown feature with translations and animation.
[2026-01-14] - Performance Optimization - Fixed website slowness/crashes by migrating large university images from database Base64 strings to Supabase Storage.
[2026-01-14] - Program Requirements Toggle - Added ability to toggle and manage program-specific admission requirements in Program Dialog.

[2026-01-14] - Google Login Fix - Fixed Google OAuth login not working due to incorrect import paths. Auth pages were importing from a stub file (actions.ts) instead of the actual implementation (actions/index.ts). Fixed imports in login, register, forgot-password pages, LogoutButton, and Navbar components.

[2026-01-14] - Chen Wei AI Chat Removal & Zoho SalesIQ Fix - Completely removed Chen Wei AI chat widget (deleted components/ai, lib/ai, api/ai folders). Fixed Zoho SalesIQ close button by adding proper z-index and pointer-events CSS rules.

[2026-01-14] - Chat Widget Close Button Fix - Fixed issue where the chat widget could be opened but not closed. Added event.stopPropagation() and event.preventDefault() to prevent event bubbling issues.

[2026-01-06] - Program Application Deadline Fix - Fixed bug where application deadline was not being saved when editing or adding programs in admin university panel.

[2026-01-05] - Zoho PageSense & WhatsApp Footer Link - Added Zoho PageSense tracking script to layout and WhatsApp link to footer.

- Fixed Zoho PageSense script placement (moved to `<body>` to allow correct `beforeInteractive` hoisting by Next.js).

2026-02-26 - GEO Improvements - Injected JSON-LD schemas (Organization, Breadcrumb, Course, University, FAQ) across main public pages and ensured semantic structural headings to improve AI Search Engine Generative Engine Optimization (GEO) compatibility.

2026-02-26 - GEO Validation - Handled audit pass over codebase, raising score to 22%. It highlights the need to inject JSON-LD at an application layer for deep components.

2026-02-26 - GEO Validation - Handled geo_checker audit pass over codebase, raising score to 22. It highlights the need to inject JSON-LD at an application layer for deep components.
