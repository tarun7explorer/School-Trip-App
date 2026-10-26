-- Sample trip catalogue and private school enquiry schema.
create table if not exists public.trips (
  slug text primary key check (slug in ('hyderabad-stem', 'jaipur-heritage', 'delhi-discovery')),
  city text not null,
  theme text not null,
  learning_purpose text not null
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.trip_interests (
  id uuid primary key default gen_random_uuid(),
  teacher_name text not null check (char_length(btrim(teacher_name)) between 2 and 120),
  school_name text not null check (char_length(btrim(school_name)) between 2 and 160),
  email text not null check (char_length(email) <= 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone text not null check (phone ~ '^\+?[0-9][0-9 ().-]{5,22}[0-9]$'),
  trip_slug text not null references public.trips(slug),
  student_count integer not null check (student_count between 1 and 300),
  created_at timestamptz not null default now()
);

create index if not exists trip_interests_created_at_idx on public.trip_interests (created_at desc);
create index if not exists trip_interests_trip_created_at_idx on public.trip_interests (trip_slug, created_at desc);

alter table public.trips enable row level security;
alter table public.admin_users enable row level security;
alter table public.trip_interests enable row level security;

create policy "Trip themes are publicly readable"
  on public.trips for select to anon, authenticated using (true);

create policy "Administrators can read their membership"
  on public.admin_users for select to authenticated using (user_id = (select auth.uid()));

create policy "Administrators can read trip interests"
  on public.trip_interests for select to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

-- Only the server-side submission action writes with its private service client.
-- Public and signed-in clients receive no write access to enquiry rows.
revoke all on public.trip_interests from anon, authenticated;
grant select on public.trip_interests to authenticated;

revoke all on public.trips from anon, authenticated;
grant select on public.trips to anon, authenticated;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

-- No public INSERT, UPDATE or DELETE policy is created for any application table.
-- Admin membership is provisioned by a trusted operator; authenticated users
-- cannot grant themselves admin access.
