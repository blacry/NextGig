-- Persist self-declared/custom skills in the shared skills catalog.
-- The application already stores verification separately on student_skills, so
-- custom skills remain useful without being presented as verified.
create unique index if not exists skills_name_lower_unique
  on public.skills (lower(name));

-- Keep application rows unique and make the application RPC safe to retry.
create unique index if not exists applications_student_opportunity_unique
  on public.applications (student_id, opportunity_id);

create index if not exists applications_student_stage_index
  on public.applications (student_id, current_stage);

create index if not exists application_stage_history_application_index
  on public.application_stage_history (application_id, occurred_at desc);
