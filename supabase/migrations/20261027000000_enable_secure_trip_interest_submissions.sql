-- Upgrade existing projects to accept only validated public inserts.
alter table public.trip_interests
  drop constraint if exists trip_interests_teacher_name_check,
  drop constraint if exists trip_interests_school_name_check,
  drop constraint if exists trip_interests_email_check,
  drop constraint if exists trip_interests_phone_check,
  drop constraint if exists trip_interests_student_count_check;

alter table public.trip_interests
  add constraint trip_interests_teacher_name_check check (char_length(btrim(teacher_name)) between 2 and 120),
  add constraint trip_interests_school_name_check check (char_length(btrim(school_name)) between 2 and 160),
  add constraint trip_interests_email_check check (char_length(email) <= 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  add constraint trip_interests_phone_check check (phone ~ '^\+?[0-9][0-9 ().-]{5,22}[0-9]$'),
  add constraint trip_interests_student_count_check check (student_count between 1 and 300);

create index if not exists trip_interests_created_at_idx on public.trip_interests (created_at desc);
create index if not exists trip_interests_trip_created_at_idx on public.trip_interests (trip_slug, created_at desc);

drop policy if exists "Public can submit validated trip interests" on public.trip_interests;
revoke all on public.trip_interests from anon, authenticated;
grant select on public.trip_interests to authenticated;

revoke all on public.trips from anon, authenticated;
grant select on public.trips to anon, authenticated;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
