-- Link existing students to a registered institution when their saved
-- institution name matches. New students are linked in complete-onboarding.
update public.students as student
set institution_id = institution.id
from public.institutions as institution
where student.institution_id is null
  and (
    lower(trim(student.institution)) = lower(trim(institution.name))
    or lower(trim(student.institution)) like lower(trim(institution.name)) || ',%'
  );

-- Institution administrators can read only students linked to their own
-- campus; they cannot see a roster from another institution.
create policy "Institution members view their students"
  on public.students for select
  using (
    exists (
      select 1
      from public.institution_members as member
      where member.institution_id = students.institution_id
        and member.user_id = auth.uid()
        and member.is_active = true
    )
  );
