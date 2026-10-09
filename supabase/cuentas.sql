-- Cuentas, Censo del Hincha y favoritos (Supabase). Se corre una sola vez en el editor SQL del proyecto, después de
-- schema.sql. Es seguro correrlo de nuevo: no borra nada.
--
-- Censo del Hincha: cada cuenta elige UN club (de cualquier país), el que es de verdad su club. Se guarda el número
-- del club en el sitio (club_id), su nombre y su logo tal como se eligió, y de dónde salió (ESPN o la historia del sitio).

alter table public.profiles add column if not exists club_name text;
alter table public.profiles add column if not exists club_logo text;
alter table public.profiles add column if not exists country text default 'AR';
-- El usuario y el nombre siguen siendo obligatorios (schema.sql); el año de nacimiento y la ciudad, opcionales.

-- Favoritos: equipos y ligas que sigue cada cuenta.
create table if not exists public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('team', 'league')),
  ref text not null check (char_length(ref) between 1 and 80), -- "liga-profesional/5" (equipo) o "libertadores" (liga)
  name text not null check (char_length(name) between 1 and 80),
  logo text,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, ref)
);

alter table public.favorites enable row level security;
drop policy if exists "ver mis favoritos" on public.favorites;
create policy "ver mis favoritos" on public.favorites for select using (auth.uid() = user_id);
drop policy if exists "agregar mis favoritos" on public.favorites;
create policy "agregar mis favoritos" on public.favorites for insert with check (auth.uid() = user_id);
drop policy if exists "borrar mis favoritos" on public.favorites;
create policy "borrar mis favoritos" on public.favorites for delete using (auth.uid() = user_id);

-- Resultado del censo: cuántos hinchas tiene cada club. Solo números por club (nunca quién es quién).
create or replace view public.censo as
select club_id, max(club_name) as club_name, max(club_logo) as club_logo, count(*)::int as hinchas
from public.profiles
group by club_id
order by hinchas desc;
grant select on public.censo to anon, authenticated;

-- Suscripciones a notificaciones (para cuando se activen los avisos por celular; ver PENDIENTES.md, punto 45).
create table if not exists public.push_subscriptions (
  user_id uuid not null references public.profiles (id) on delete cascade,
  endpoint text primary key,
  keys jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
drop policy if exists "ver mis avisos" on public.push_subscriptions;
create policy "ver mis avisos" on public.push_subscriptions for select using (auth.uid() = user_id);
drop policy if exists "agregar mis avisos" on public.push_subscriptions;
create policy "agregar mis avisos" on public.push_subscriptions for insert with check (auth.uid() = user_id);
drop policy if exists "borrar mis avisos" on public.push_subscriptions;
create policy "borrar mis avisos" on public.push_subscriptions for delete using (auth.uid() = user_id);
