StudyAtChina → Antigravity Integration & Multi-Portal Database Setup
Technical Instructions for Antigravity Engineers
1️⃣ Context

Current active system: StudyAtChina.com

Tech stack: Next.js / React (Antigravity)

Database: Supabase

Project ID: mxmrdnzmaztskbkqeusm

Goal:
Convert the existing StudyAtChina setup into a multi-portal architecture using one central Supabase database.
Prepare the system so future portals (e.g., StudyAtSpain) can use the same backend, each isolated by portal_key.

2️⃣ Supabase Database Updates (StudyAtChina Project)
2.1 Add portal_key column to core tables

Run SQL migrations in Supabase to add a portal_key column (type text) to all tables tied to a specific portal.

alter table universities
add column if not exists portal_key text;

alter table programs
add column if not exists portal_key text;

alter table students
add column if not exists portal_key text;

alter table applications
add column if not exists portal_key text;

alter table agents
add column if not exists portal_key text;

alter table accommodations
add column if not exists portal_key text;

2.2 Set all existing China data to studyatchina
update universities    set portal_key = 'studyatchina' where portal_key is null;
update programs        set portal_key = 'studyatchina' where portal_key is null;
update students        set portal_key = 'studyatchina' where portal_key is null;
update applications    set portal_key = 'studyatchina' where portal_key is null;
update agents          set portal_key = 'studyatchina' where portal_key is null;
update accommodations  set portal_key = 'studyatchina' where portal_key is null;

2.3 (Optional) Scholarships – China-only
alter table scholarships
add column if not exists portal_key text;

update scholarships
set portal_key = 'studyatchina'
where portal_key is null;


From now on, all China inserts must set
portal_key = 'studyatchina'.

3️⃣ Antigravity / Next.js Updates for StudyAtChina.com
3.1 Environment variables

Configure these in Antigravity:

NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Identifies which portal this app belongs to
NEXT_PUBLIC_PORTAL_KEY=studyatchina

# Optional (server-side only)
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

3.2 Update all Supabase queries to filter by portal

Every StudyAtChina query must use:

const PORTAL_KEY = process.env.NEXT_PUBLIC_PORTAL_KEY;

const { data: universities } = await supabase
  .from('universities')
  .select('*')
  .eq('portal_key', PORTAL_KEY);


Apply this pattern to:

universities

programs

students

applications

accommodations

agents

scholarships (if used)

3.3 Ensure inserts/write operations set portal_key
await supabase
  .from('applications')
  .insert({
    portal_key: PORTAL_KEY,
    // ...
  });

3.4 Admin panel (China) must be portal-scoped

All /admin pages must filter by portal_key:

.eq('portal_key', PORTAL_KEY)


Admins should only see/manage China data.

4️⃣ (Optional) RLS / Security

If using RLS:

Public website can allow read or use simple filtering.

Each admin user can have admin_portal_key in profiles.

Policy concept:

portal_key = (select admin_portal_key 
              from profiles 
              where profiles.id = auth.uid())

5️⃣ Expected Outcome

After these steps:

StudyAtChina will operate using a multi-portal-ready central database.

All China data is tagged with portal_key = 'studyatchina'.

The frontend + admin are fully aligned with portal-scoped data.

The system becomes ready for cloning into StudyAtSpain, simply by:

Changing branding

Setting NEXT_PUBLIC_PORTAL_KEY=studyatspain

Inserting Spain-specific data into the same Supabase database