-- =====================================================================
-- Migration: 202609130001_full_institution_schema.sql
-- Description: Full schema for Institutions, Faculty, Placement Drives,
--              Member Roles, and Student Verifications.
-- =====================================================================

-- 1. Create Institutions Table
create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  code text,
  type text not null default 'University',
  official_email text not null,
  website_url text,
  phone text,
  address text,
  city text not null,
  state text not null,
  country text not null default 'India',
  admin_name text not null,
  admin_role text not null default 'Head of Training & Placements',
  cohort_size text,
  programs_offered text[] default '{}',
  logo_url text,
  banner_url text,
  verified boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast lookup by slug and name
create index if not exists idx_institutions_slug on public.institutions (slug);
create index if not exists idx_institutions_name_lower on public.institutions (lower(name));

-- 2. Add institution_id to profiles if missing
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
      and table_name = 'profiles' 
      and column_name = 'institution_id'
  ) then
    alter table public.profiles 
      add column institution_id uuid references public.institutions(id) on delete set null;
  end if;
end $$;

-- 3. Add institution_id to students if missing
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
      and table_name = 'students' 
      and column_name = 'institution_id'
  ) then
    alter table public.students 
      add column institution_id uuid references public.institutions(id) on delete set null;
  end if;
end $$;

-- 4. Create Institution Members Table
create table if not exists public.institution_members (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'admin', -- 'admin' | 'faculty' | 'placement_officer' | 'evaluator'
  department text,
  designation text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint institution_members_inst_user_unique unique (institution_id, user_id)
);

create index if not exists idx_inst_members_institution on public.institution_members (institution_id);
create index if not exists idx_inst_members_user on public.institution_members (user_id);

-- 5. Create Institution Faculty Roster Table
create table if not exists public.institution_faculty (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  department text not null,
  designation text not null,
  verified_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint institution_faculty_inst_email_unique unique (institution_id, email)
);

create index if not exists idx_inst_faculty_institution on public.institution_faculty (institution_id);

-- 6. Create Institution Placement Drives Table
create table if not exists public.institution_placement_drives (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  company_name text not null,
  role_title text not null,
  eligibility_criteria text not null,
  compensation text not null,
  deadline timestamptz,
  status text not null default 'Active Drive', -- 'Active Drive' | 'Upcoming' | 'Completed'
  applicants_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_inst_drives_institution on public.institution_placement_drives (institution_id);
create index if not exists idx_inst_drives_status on public.institution_placement_drives (status);

-- 7. Create Institution Student Verifications Table
create table if not exists public.institution_student_verifications (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  evaluator_id uuid references public.profiles(id) on delete set null,
  project_title text not null,
  project_description text,
  tech_stack text[] default '{}',
  project_url text,
  verified_skills text[] default '{}',
  status text not null default 'pending', -- 'pending' | 'verified' | 'rejected'
  feedback_note text,
  requested_at timestamptz not null default now(),
  verified_at timestamptz
);

create index if not exists idx_inst_verifications_institution on public.institution_student_verifications (institution_id);
create index if not exists idx_inst_verifications_student on public.institution_student_verifications (student_id);
create index if not exists idx_inst_verifications_status on public.institution_student_verifications (status);

-- 8. Row Level Security (RLS) Policies
alter table public.institutions enable row level security;
alter table public.institution_members enable row level security;
alter table public.institution_faculty enable row level security;
alter table public.institution_placement_drives enable row level security;
alter table public.institution_student_verifications enable row level security;

-- Public read access for institutions and placement drives
create policy "Institutions are viewable by everyone" 
  on public.institutions for select 
  using (true);

create policy "Institutions insertable by authenticated users" 
  on public.institutions for insert 
  with check (auth.role() = 'authenticated');

create policy "Institutions updateable by creator or members" 
  on public.institutions for update 
  using (
    auth.uid() = created_by or 
    exists (
      select 1 from public.institution_members im 
      where im.institution_id = institutions.id and im.user_id = auth.uid()
    )
  );

create policy "Institution members viewable by authenticated" 
  on public.institution_members for select 
  using (auth.role() = 'authenticated');

create policy "Institution members manageable by institution admins" 
  on public.institution_members for all 
  using (
    exists (
      select 1 from public.institution_members im 
      where im.institution_id = institution_members.institution_id 
        and im.user_id = auth.uid() 
        and im.role = 'admin'
    ) or exists (
      select 1 from public.institutions inst 
      where inst.id = institution_members.institution_id 
        and inst.created_by = auth.uid()
    )
  );

create policy "Placement drives viewable by authenticated" 
  on public.institution_placement_drives for select 
  using (auth.role() = 'authenticated');

create policy "Student verifications viewable by student and institution members" 
  on public.institution_student_verifications for select 
  using (
    student_id = auth.uid() or
    exists (
      select 1 from public.institution_members im 
      where im.institution_id = institution_student_verifications.institution_id 
        and im.user_id = auth.uid()
    )
  );

-- 9. Automatic updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_institutions_updated_at
  before update on public.institutions
  for each row execute function public.handle_updated_at();

create trigger set_institution_drives_updated_at
  before update on public.institution_placement_drives
  for each row execute function public.handle_updated_at();
