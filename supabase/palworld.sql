-- Progression commune de la page Palworld : tout le monde voit et coche les mêmes cases, sans compte.
--
-- À coller dans Supabase, projet `cours`, SQL Editor, puis Run. Tout se fait en une fois :
-- en cas d'erreur, rien n'est changé. Le script peut être relancé.
--
-- Anyone with the page may read every box and change any of them, on purpose. Writes only go
-- through palworld_set(), which accepts nothing but item ids and caps the table size, so a visitor
-- cannot fill the database with anything else.

begin;

-- 1. One row per item: id is "<type>:<x>,<y>" (game position), changed_at is the server time.
create table if not exists public.palworld_items (
	id text primary key,
	checked boolean not null,
	changed_at timestamptz not null default now()
);
create index if not exists palworld_items_changed_at on public.palworld_items (changed_at);
alter table public.palworld_items enable row level security;

-- 2. Everyone reads, nobody writes directly.
revoke all on public.palworld_items from anon, authenticated;
grant select on public.palworld_items to anon, authenticated;
drop policy if exists "palworld_items: everyone reads" on public.palworld_items;
create policy "palworld_items: everyone reads" on public.palworld_items
	for select to anon, authenticated
	using (true);

-- 3. Ticking and unticking: a list of {"id": "...", "checked": true|false}, latest call wins.
create or replace function public.palworld_set(changes jsonb)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
	now_ timestamptz := clock_timestamp();
	change jsonb;
begin
	if jsonb_typeof(changes) <> 'array' or jsonb_array_length(changes) > 1000 then
		raise exception 'palworld_set attend une liste de 1000 changements au plus';
	end if;
	for change in select value from jsonb_array_elements(changes) loop
		if coalesce(change ->> 'id', '') !~ '^(statue|ruine|journal):-?[0-9]{1,9},-?[0-9]{1,9}$'
			or jsonb_typeof(change -> 'checked') is distinct from 'boolean' then
			raise exception 'changement invalide : %', left(change::text, 100);
		end if;
		insert into public.palworld_items (id, checked, changed_at)
		values (change ->> 'id', (change ->> 'checked')::boolean, now_)
		on conflict (id) do update set checked = excluded.checked, changed_at = excluded.changed_at;
	end loop;
	if (select count(*) from public.palworld_items) > 2000 then
		raise exception 'trop d''objets dans palworld_items';
	end if;
	return now_;
end
$$;
revoke all on function public.palworld_set(jsonb) from public;
grant execute on function public.palworld_set(jsonb) to anon, authenticated;

commit;
