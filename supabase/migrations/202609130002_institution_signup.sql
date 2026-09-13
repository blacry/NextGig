-- Make the account role chosen at sign-up authoritative. The previous auth
-- trigger defaulted every new account to student, so an institution account
-- was sent into student onboarding before it could create its workspace.

alter type public.user_role add value if not exists 'academician';
alter type public.user_role add value if not exists 'institution';
