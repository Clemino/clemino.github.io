-- Chacun ne voit que ses matières.
--
-- À coller dans Supabase, projet `cours`, SQL Editor, puis Run. Avant de lancer,
-- remplacer `ton.adresse@gmail.com` (étape 7) par l'adresse du compte Google de Clément.
-- Tout se fait en une fois : en cas d'erreur, rien n'est changé. Le script peut être relancé.
--
-- Who sees what:
-- - an administrator sees and follows every course, and gives courses to people;
-- - anyone else sees only the courses in `course_access`: the ones they proposed and
--   that were created, the ones an administrator gave them, and the ones they already
--   followed when this script first ran.
-- Courses check access by reading `followed_courses`: a row for a course without access
-- stays in the table, with its progress, but is hidden until access comes back.

begin;

do $$
begin
	if not exists (
		select 1 from information_schema.columns
		where table_schema = 'public' and table_name = 'followed_courses' and column_name = 'user_id'
	) then
		raise exception 'followed_courses n''a pas de colonne user_id : envoie ce message à Claude.';
	end if;
end $$;

-- 1. Administrators. No policy: the site reads it only through is_admin().
create table if not exists public.admins (
	user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
	select exists (select 1 from public.admins where user_id = (select auth.uid()))
$$;

-- 2. People, so that an administrator can pick who gets a course.
create table if not exists public.people (
	id uuid primary key references auth.users (id) on delete cascade,
	email text,
	name text,
	created_at timestamptz not null default now()
);
alter table public.people enable row level security;
drop policy if exists "people: self or admin" on public.people;
create policy "people: self or admin" on public.people
	for select to authenticated
	using (id = (select auth.uid()) or public.is_admin());

create or replace function public.sync_person()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
	insert into public.people (id, email, name)
	values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'))
	on conflict (id) do update set email = excluded.email, name = excluded.name;
	return new;
end
$$;
drop trigger if exists sync_person on auth.users;
create trigger sync_person
	after insert or update of email, raw_user_meta_data on auth.users
	for each row execute function public.sync_person();

insert into public.people (id, email, name)
select id, email, coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name')
from auth.users
on conflict (id) do update set email = excluded.email, name = excluded.name;

-- 3. Who may see which course. Only an administrator gives or takes access.
create table if not exists public.course_access (
	user_id uuid not null references auth.users (id) on delete cascade,
	course text not null,
	granted_at timestamptz not null default now(),
	primary key (user_id, course)
);
alter table public.course_access enable row level security;
drop policy if exists "course_access: own, or all for admin" on public.course_access;
create policy "course_access: own, or all for admin" on public.course_access
	for select to authenticated
	using (user_id = (select auth.uid()) or public.is_admin());
drop policy if exists "course_access: admin gives" on public.course_access;
create policy "course_access: admin gives" on public.course_access
	for insert to authenticated
	with check (public.is_admin());
drop policy if exists "course_access: admin takes back" on public.course_access;
create policy "course_access: admin takes back" on public.course_access
	for delete to authenticated
	using (public.is_admin());

create or replace function public.has_access(course_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
	select public.is_admin()
		or exists (select 1 from public.course_access where user_id = (select auth.uid()) and course = course_id)
$$;

-- 4. Nobody loses a course they already follow, and each created proposal goes to its author.
insert into public.course_access (user_id, course)
select user_id, course from public.followed_courses
on conflict do nothing;

insert into public.course_access (user_id, course)
select user_id, course_id from public.course_proposals
where status = 'created' and course_id is not null
on conflict do nothing;

-- 5. Following a course needs access to it, and a course without access is hidden.
alter table public.followed_courses enable row level security;
do $$
declare
	p record;
begin
	for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'followed_courses' loop
		execute format('drop policy %I on public.followed_courses', p.policyname);
	end loop;
end $$;
create policy "followed_courses: own, if allowed" on public.followed_courses
	for select to authenticated
	using (user_id = (select auth.uid()) and public.has_access(course));
create policy "followed_courses: follow, if allowed" on public.followed_courses
	for insert to authenticated
	with check (user_id = (select auth.uid()) and public.has_access(course));
create policy "followed_courses: unfollow own" on public.followed_courses
	for delete to authenticated
	using (user_id = (select auth.uid()));

-- 6. The site asks these through the API.
grant select on public.people to authenticated;
grant select, insert, delete on public.course_access to authenticated;
grant execute on function public.is_admin() to authenticated;

-- 7. The administrator: the address of Clément's Google account.
insert into public.admins (user_id)
select id from auth.users where email = 'ton.adresse@gmail.com'
on conflict do nothing;

do $$
begin
	if not exists (select 1 from public.admins) then
		raise exception 'Aucun administrateur : à l''étape 7, mets l''adresse Google avec laquelle tu te connectes au site, puis relance. Comptes existants : %',
			(select coalesce(string_agg(email, ', ' order by email), 'aucun') from auth.users);
	end if;
end $$;

commit;
