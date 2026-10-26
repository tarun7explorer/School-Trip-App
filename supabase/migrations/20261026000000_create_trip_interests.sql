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
  teacher_name text not null check (char_length(teacher_name) between 2 and 120),
  school_name text not null check (char_length(school_name) between 2 and 160),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) between 7 and 24),
  trip_slug text not null references public.trips(slug),
  student_count integer not null check (student_count > 0 and student_count <= 100000),
  created_at timestamptz not null default now()
);

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

-- Deliberately no public INSERT or UPDATE policy is created. Add a guarded
-- server submission path and its constrained database policy before accepting enquiries.
-- Admin membership is provisioned by a trusted operator; authenticated users
-- cannot grant themselves admin access.
