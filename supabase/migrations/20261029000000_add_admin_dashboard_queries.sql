-- Aggregate and page private enquiry data inside Postgres. These invoker
-- functions retain trip_interests RLS and do not bypass the admin allowlist.
create or replace function public.get_admin_interest_summary()
returns table (trip_slug text, enquiry_count bigint, student_count bigint)
language sql
stable
security invoker
set search_path = pg_catalog, public
as $$
  select t.slug,
         count(i.id)::bigint,
         coalesce(sum(i.student_count), 0)::bigint
  from public.trips as t
  left join public.trip_interests as i on i.trip_slug = t.slug
  group by t.slug
  order by t.slug;
$$;

create or replace function public.get_admin_interest_count(
  p_trip_slug text,
  p_search text
)
returns bigint
language plpgsql
stable
security invoker
set search_path = pg_catalog, public
as $$
begin
  if p_trip_slug is not null and p_trip_slug not in ('hyderabad-stem', 'jaipur-heritage', 'delhi-discovery') then
    raise exception 'Invalid destination filter' using errcode = '22023';
  end if;
  if p_search is not null and char_length(p_search) > 100 then
    raise exception 'Search query is too long' using errcode = '22023';
  end if;

  return (
    select count(*)::bigint
    from public.trip_interests as i
    where (p_trip_slug is null or i.trip_slug = p_trip_slug)
      and (p_search is null or strpos(
        lower(concat_ws(' ', i.teacher_name, i.school_name, i.email, i.phone)),
        lower(p_search)
      ) > 0)
  );
end;
$$;

create or replace function public.get_admin_interest_page(
  p_trip_slug text,
  p_search text,
  p_limit integer,
  p_offset integer
)
returns table (
  teacher_name text,
  school_name text,
  email text,
  phone text,
  trip_slug text,
  student_count integer,
  created_at timestamptz
)
language plpgsql
stable
security invoker
set search_path = pg_catalog, public
as $$
begin
  if p_trip_slug is not null and p_trip_slug not in ('hyderabad-stem', 'jaipur-heritage', 'delhi-discovery') then
    raise exception 'Invalid destination filter' using errcode = '22023';
  end if;
  if p_search is not null and char_length(p_search) > 100 then
    raise exception 'Search query is too long' using errcode = '22023';
  end if;
  if p_limit < 1 or p_limit > 100 or p_offset < 0 or p_offset > 1000000 then
    raise exception 'Invalid pagination values' using errcode = '22023';
  end if;

  return query
  select i.teacher_name, i.school_name, i.email, i.phone, i.trip_slug,
         i.student_count, i.created_at
  from public.trip_interests as i
  where (p_trip_slug is null or i.trip_slug = p_trip_slug)
    and (p_search is null or strpos(
      lower(concat_ws(' ', i.teacher_name, i.school_name, i.email, i.phone)),
      lower(p_search)
    ) > 0)
  order by i.created_at desc, i.id desc
  limit p_limit
  offset p_offset;
end;
$$;

revoke all on function public.get_admin_interest_summary() from public, anon;
revoke all on function public.get_admin_interest_count(text, text) from public, anon;
revoke all on function public.get_admin_interest_page(text, text, integer, integer) from public, anon;
grant execute on function public.get_admin_interest_summary() to authenticated;
grant execute on function public.get_admin_interest_count(text, text) to authenticated;
grant execute on function public.get_admin_interest_page(text, text, integer, integer) to authenticated;
