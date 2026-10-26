-- Keep private enquiry access tied to the authenticated JWT and explicit allowlist.
alter table public.admin_users enable row level security;
alter table public.trip_interests enable row level security;

revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
revoke all on public.trip_interests from anon, authenticated;
grant select on public.trip_interests to authenticated;

drop policy if exists "Administrators can read their membership" on public.admin_users;
create policy "Administrators can read their membership"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Administrators can read trip interests" on public.trip_interests;
create policy "Administrators can read trip interests"
  on public.trip_interests for select to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

comment on table public.admin_users is
  'Trusted operator-managed allowlist. Application users cannot insert, update, or delete membership rows.';
comment on table public.trip_interests is
  'Private teacher enquiries. SELECT is limited by RLS to authenticated users in public.admin_users; writes use a server-only validated submission path.';
