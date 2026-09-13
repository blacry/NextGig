-- This runs after the enum-value migration commits: PostgreSQL does not let a
-- newly-added enum value be used by an UPDATE or function body in the same
-- transaction.

-- Repair accounts made by the old trigger. Their requested role is already
-- safely recorded in Auth metadata; only student rows whose metadata requests
-- a supported non-student role are changed.
update public.profiles as profile
set role = (auth_user.raw_user_meta_data ->> 'role')::public.user_role
from auth.users as auth_user
where profile.id = auth_user.id
  and profile.role = 'student'
  and auth_user.raw_user_meta_data ->> 'role' in ('academician', 'institution');

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requested_role public.user_role;
  display_name text;
  base_slug text;
begin
  requested_role := coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'student')::public.user_role;
  display_name := coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1));
  base_slug := trim(both '-' from regexp_replace(lower(display_name), '[^a-z0-9]+', '-', 'g'));
  base_slug := coalesce(nullif(base_slug, ''), 'member');

  insert into public.profiles (id, name, email, role, slug)
  values (new.id, display_name, new.email, requested_role, base_slug || '-' || left(new.id::text, 8));

  if requested_role = 'student' then
    insert into public.students (id, degree, field, institution, year, onboarding_complete)
    values (new.id, 'Not specified', 'General', 'Not specified', extract(year from current_date)::integer, false);
  elsif requested_role = 'recruiter' then
    insert into public.recruiters (id) values (new.id);
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
