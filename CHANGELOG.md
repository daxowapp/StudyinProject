# Changelog

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
