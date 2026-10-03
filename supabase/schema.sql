-- Base de datos del foro del hincha y de las cuentas (Supabase). Se corre una sola vez en el editor SQL del proyecto
-- de Supabase. Las cuentas usan el registro de Supabase (correo y contraseña); acá van el perfil, los mensajes y los
-- me gusta. Cada tabla tiene reglas (RLS): todos pueden leer; cada uno solo escribe y borra lo suyo.

-- Perfil: usuario, nombre y club del que es hincha.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  name text not null check (char_length(name) between 2 and 60),
  club_id text not null,
  city text check (char_length(city) <= 60),
  birth_year int check (birth_year between 1900 and 2100),
  created_at timestamptz not null default now()
);

-- Mensajes: uno por partido (topic_id = id del partido en el sitio); parent_id para las respuestas.
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  topic_id text not null,
  parent_id uuid references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  text text not null check (char_length(text) between 1 and 280),
  created_at timestamptz not null default now()
);
create index if not exists posts_topic_idx on public.posts (topic_id, created_at desc);

-- Me gusta: uno por usuario y mensaje.
create table if not exists public.likes (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- Mensajes con su autor y la cantidad de me gusta, para leerlos en una sola consulta.
create or replace view public.posts_view with (security_invoker = on) as
select p.*, pr.username, pr.name, pr.club_id, (select count(*) from public.likes l where l.post_id = p.id)::int as like_count
from public.posts p
join public.profiles pr on pr.id = p.author_id;

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;

create policy "perfiles visibles" on public.profiles for select using (true);
create policy "crear mi perfil" on public.profiles for insert with check (auth.uid() = id);
create policy "editar mi perfil" on public.profiles for update using (auth.uid() = id);

create policy "mensajes visibles" on public.posts for select using (true);
create policy "publicar como yo" on public.posts for insert with check (auth.uid() = author_id);
create policy "borrar lo mío" on public.posts for delete using (auth.uid() = author_id);

create policy "me gusta visibles" on public.likes for select using (true);
create policy "dar me gusta" on public.likes for insert with check (auth.uid() = user_id);
create policy "sacar me gusta" on public.likes for delete using (auth.uid() = user_id);
