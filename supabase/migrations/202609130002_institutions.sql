-- Normalized institution directory. Keep students.institution for backward compatibility
-- while allowing new and migrated profiles to reference a canonical institution.
create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_key text generated always as (lower(regexp_replace(trim(name), '\\s+', ' ', 'g'))) stored,
  short_name text,
  institution_type text not null default 'university'
    check (institution_type in ('university', 'college', 'bootcamp', 'training_center', 'school', 'other')),
  description text,
  website_url text,
  logo_url text,
  country text not null default 'Unknown',
  state_region text,
  city text,
  address text,
  latitude double precision,
  longitude double precision,
  is_verified boolean not null default false,
  is_active boolean not null default true,
  verified_at timestamptz,
  verified_by uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint institutions_name_not_blank check (length(trim(name)) >= 2),
  constraint institutions_latitude_valid check (latitude is null or latitude between -90 and 90),
  constraint institutions_longitude_valid check (longitude is null or longitude between -180 and 180),
  constraint institutions_website_valid check (website_url is null or website_url ~* '^https?://'),
  constraint institutions_logo_valid check (logo_url is null or logo_url ~* '^https?://')
);

-- A name may repeat in different countries, but not within the same country.
create unique index if not exists institutions_name_country_unique
  on public.institutions (name_key, lower(trim(country)));

create index if not exists institutions_active_verified_index
  on public.institutions (is_active, is_verified, lower(name));
create index if not exists institutions_location_index
  on public.institutions (lower(country), lower(state_region), lower(city));

-- Maintain updated_at without requiring application code to remember it.
create or replace function public.set_institutions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists institutions_set_updated_at on public.institutions;
create trigger institutions_set_updated_at
  before update on public.institutions
  for each row execute function public.set_institutions_updated_at();

-- Link students to canonical institutions without changing existing free-text data.
alter table public.students
  add column if not exists institution_id uuid references public.institutions(id) on delete set null;

create index if not exists students_institution_id_index
  on public.students (institution_id);

alter table public.institutions enable row level security;

-- Both signed-in personas may discover active institutions.
drop policy if exists "Authenticated users can view active institutions" on public.institutions;
create policy "Authenticated users can view active institutions"
  on public.institutions for select
  to authenticated
  using (is_active = true);

-- No client insert/update/delete policy is created intentionally. Institution
-- administration should use a trusted service role or a future admin role.

comment on table public.institutions is 'Canonical institution directory; students.institution remains as legacy free text during migration.';
comment on column public.students.institution_id is 'Optional canonical institution reference; nullable for legacy/free-text profiles.';
