-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  first_name text,
  last_name text,
  role text default 'student' check (role in ('student', 'admin')),
  nationality text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Universities Table
create table if not exists public.universities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  city text not null,
  province text,
  logo_url text,
  banner_url text,
  description text,
  website text,
  ranking text,
  founded_year text,
  student_count text,
  intl_student_count text,
  features text[], -- e.g. ["Project 985", "C9 League"]
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Programs Table
create table if not exists public.programs (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid references public.universities(id) on delete cascade not null,
  title text not null,
  level text not null, -- Bachelor, Master, PhD, Non-Degree
  field text, -- CS, Business, etc.
  duration text,
  tuition_fee integer, -- in RMB
  currency text default 'RMB',
  language text default 'English',
  deadline date,
  intake text, -- e.g. "September 2025"
  description text,
  requirements jsonb, -- { academic: [], language: [], documents: [] }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Applications Table
create table if not exists public.applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  program_id uuid references public.programs(id) on delete cascade not null,
  status text default 'draft' check (status in ('draft', 'submitted', 'under_review', 'accepted', 'rejected')),
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  personal_info jsonb, -- Snapshot of profile at submission
  documents jsonb, -- { passport: url, transcript: url }
  submitted_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.universities enable row level security;
alter table public.programs enable row level security;
alter table public.applications enable row level security;

-- 6. RLS Policies

-- Profiles: Users can read/update their own profile. Public can read basic info (optional, restricted for now).
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Universities & Programs: Public read access
drop policy if exists "Public universities read access" on public.universities;
create policy "Public universities read access" on public.universities
  for select using (true);

drop policy if exists "Public programs read access" on public.programs;
create policy "Public programs read access" on public.programs
  for select using (true);

-- Applications: Users can CRUD their own applications
drop policy if exists "Users can view own applications" on public.applications;
create policy "Users can view own applications" on public.applications
  for select using (auth.uid() = user_id);

drop policy if exists "Users can create applications" on public.applications;
create policy "Users can create applications" on public.applications
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own draft applications" on public.applications;
create policy "Users can update own draft applications" on public.applications
  for update using (auth.uid() = user_id);

-- Admin Policies (Simplified: Assume admin has a specific email or role claim)
-- For now, we'll create a function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Admin Access
drop policy if exists "Admins can do everything on universities" on public.universities;
create policy "Admins can do everything on universities" on public.universities
  for all using (public.is_admin());

drop policy if exists "Admins can do everything on programs" on public.programs;
create policy "Admins can do everything on programs" on public.programs
  for all using (public.is_admin());

drop policy if exists "Admins can view all applications" on public.applications;
create policy "Admins can view all applications" on public.applications
  for select using (public.is_admin());

drop policy if exists "Admins can update applications" on public.applications;
create policy "Admins can update applications" on public.applications
  for update using (public.is_admin());

-- 7. Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 8. Academic Years & Intakes
create table if not exists public.academic_years (
  id uuid default uuid_generate_v4() primary key,
  name text not null, -- e.g. "2024-2025"
  start_date date not null,
  end_date date not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.intakes (
  id uuid default uuid_generate_v4() primary key,
  academic_year_id uuid references public.academic_years(id) on delete cascade not null,
  name text not null, -- e.g. "Fall 2024"
  start_date date not null,
  end_date date not null,
  is_open boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Languages
create table if not exists public.languages (
  id uuid default uuid_generate_v4() primary key,
  name text not null, -- e.g. "English", "Chinese"
  code text not null, -- e.g. "en", "zh"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Leads
create table if not exists public.leads (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  source text default 'contact_form',
  message text,
  status text default 'new' check (status in ('new', 'contacted', 'qualified', 'converted', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Update Programs Table
alter table public.programs add column if not exists is_active boolean default true;
alter table public.programs add column if not exists scholarship_chance text; -- e.g. "10-100%"
alter table public.programs add column if not exists application_fee integer default 0;
alter table public.programs add column if not exists service_fee integer default 0;
alter table public.programs add column if not exists has_force_payment boolean default false;
alter table public.programs add column if not exists language_id uuid references public.languages(id);

-- 12. Update Applications Table
alter table public.applications add column if not exists stage text default 'new'; -- Customizable pipeline
alter table public.applications add column if not exists comments jsonb default '[]';
alter table public.applications add column if not exists payment_required boolean default false;

-- 13. RLS for New Tables
alter table public.academic_years enable row level security;
alter table public.intakes enable row level security;
alter table public.languages enable row level security;
alter table public.leads enable row level security;

-- Public read access for reference tables
drop policy if exists "Public academic_years read access" on public.academic_years;
create policy "Public academic_years read access" on public.academic_years for select using (true);

drop policy if exists "Public intakes read access" on public.intakes;
create policy "Public intakes read access" on public.intakes for select using (true);

drop policy if exists "Public languages read access" on public.languages;
create policy "Public languages read access" on public.languages for select using (true);

-- Admin access for all new tables
drop policy if exists "Admins can do everything on academic_years" on public.academic_years;
create policy "Admins can do everything on academic_years" on public.academic_years for all using (public.is_admin());

drop policy if exists "Admins can do everything on intakes" on public.intakes;
create policy "Admins can do everything on intakes" on public.intakes for all using (public.is_admin());

drop policy if exists "Admins can do everything on languages" on public.languages;
create policy "Admins can do everything on languages" on public.languages for all using (public.is_admin());

drop policy if exists "Admins can do everything on leads" on public.leads;
create policy "Admins can do everything on leads" on public.leads for all using (public.is_admin());

-- Leads: Public create access (for contact forms)
drop policy if exists "Public can create leads" on public.leads;
create policy "Public can create leads" on public.leads for insert with check (true);

