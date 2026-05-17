-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- RACES
-- ============================================================
create table public.races (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  description text,
  image_key   text not null  -- matches bundled asset filename, e.g. "elf_1"
);

-- ============================================================
-- CLASSES
-- ============================================================
create table public.classes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  description text,
  base_health integer not null default 100
);

-- ============================================================
-- ACTIONS
-- ============================================================
create table public.actions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,  -- unique DB key, e.g. "warrior_fight"
  label       text not null,         -- display name shown on screen, e.g. "Fight"
  icon_name   text not null,
  description text
);

-- ============================================================
-- CLASS_ACTIONS (junction: which actions a class can perform)
-- ============================================================
create table public.class_actions (
  class_id  uuid not null references public.classes(id) on delete cascade,
  action_id uuid not null references public.actions(id) on delete cascade,
  primary key (class_id, action_id)
);

-- ============================================================
-- SKINS
-- ============================================================
create table public.skins (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  race_id   uuid not null references public.races(id) on delete cascade,
  image_key text not null  -- e.g. "elf_1" -> assets/skins/elf_1.png
);

-- ============================================================
-- GROUPS
-- (group_code is the primary key as designed)
-- ============================================================
create table public.groups (
  group_code  char(6) primary key,
  group_name  text not null,
  created_by  uuid not null references auth.users(id) on delete cascade,
  status      text not null default 'lobby'
              check (status in ('lobby', 'playing', 'ended')),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- CHARACTERS
-- ============================================================
create table public.characters (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  race_id   uuid references public.races(id),
  class_id  uuid references public.classes(id),
  skin_id   uuid references public.skins(id),
  unique (user_id)  -- one character per user
);

-- ============================================================
-- USERS (profile data linked to auth.users)
-- ============================================================
create table public.users (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null unique,
  username        text not null unique,
  character_id    uuid references public.characters(id),
  current_group   char(6) references public.groups(group_code),
  created_at      timestamptz not null default now()
);

-- Auto-create a user profile row when a new auth user is created
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', 'Player')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- GAME EVENTS
-- ============================================================
create table public.game_events (
  id          uuid primary key default gen_random_uuid(),
  group_id    char(6) not null references public.groups(group_code) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  event_type  text not null check (event_type in ('action', 'dice')),
  action_name text,
  die_type    text,
  die_result  integer,
  created_at  timestamptz not null default now()
);

create index on public.game_events (group_id, created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.users         enable row level security;
alter table public.groups        enable row level security;
alter table public.characters    enable row level security;
alter table public.races         enable row level security;
alter table public.classes       enable row level security;
alter table public.skins         enable row level security;
alter table public.actions       enable row level security;
alter table public.class_actions enable row level security;
alter table public.game_events   enable row level security;

-- Reference tables: readable by all authenticated users
create policy "races_read"         on public.races         for select using (true);
create policy "classes_read"       on public.classes       for select using (true);
create policy "skins_read"         on public.skins         for select using (true);
create policy "actions_read"       on public.actions       for select using (true);
create policy "class_actions_read" on public.class_actions for select using (true);

-- Users: readable by all, updatable only by owner
create policy "users_read"        on public.users for select using (true);
create policy "users_update_own"  on public.users for update using (auth.uid() = id);

-- Characters: readable by all, writable only by owner
create policy "characters_read"        on public.characters for select using (true);
create policy "characters_insert_own"  on public.characters for insert with check (auth.uid() = user_id);
create policy "characters_update_own"  on public.characters for update using (auth.uid() = user_id);

-- Groups: readable by all, insertable by authenticated users
create policy "groups_read"   on public.groups for select using (true);
create policy "groups_insert" on public.groups for insert with check (auth.uid() = created_by);

-- Game events: readable and insertable by group members
create policy "events_read" on public.game_events
  for select using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.current_group = game_events.group_id
    )
  );

create policy "events_insert" on public.game_events
  for insert with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.current_group = game_events.group_id
    )
  );

-- ============================================================
-- SEED DATA
-- ============================================================

-- Races
insert into public.races (name, description, image_key) values
  ('Elf',   'Swift and magical beings of the ancient forests.',   'elf'),
  ('Human', 'Versatile and ambitious, found across all lands.',   'human'),
  ('Dwarf', 'Stout craftspeople forged in mountain strongholds.', 'dwarf');

-- Classes (auto-assigned by race: Elf→Archer, Dwarf→Sorcerer, Human→Assassin)
insert into public.classes (name, description, base_health) values
  ('Archer',   'Swift and precise, strikes from afar.',              85),
  ('Sorcerer', 'Powerful magic wielder, fragile but deadly.',        70),
  ('Assassin', 'Stealthy and lethal, strikes from the shadows.',     90);

-- Actions (name = unique DB key sent to Unity, label = display name on screen)
insert into public.actions (name, label, icon_name, description) values
  ('archer_fight',    'Fight',  'zap',    'Loose a precise arrow.'),
  ('archer_defend',   'Defend', 'shield', 'Sidestep with elven grace.'),
  ('archer_die',      'Die',    'skull',  'Fade away into the ancient forest.'),
  ('sorcerer_fight',  'Fight',  'flame',  'Hurl a bolt of arcane energy.'),
  ('sorcerer_defend', 'Defend', 'shield', 'Conjure a magical barrier.'),
  ('sorcerer_die',    'Die',    'skull',  'Implode in a surge of wild magic.'),
  ('assassin_fight',  'Fight',  'sword',  'Strike fast from the shadows.'),
  ('assassin_defend', 'Defend', 'shield', 'Evade and roll out of harm''s way.'),
  ('assassin_die',    'Die',    'skull',  'Vanish — for good this time.');

-- Class → Actions
insert into public.class_actions (class_id, action_id)
select c.id, a.id from public.classes c, public.actions a
where
  (c.name = 'Archer'   and a.name in ('archer_fight',   'archer_defend',   'archer_die'))   or
  (c.name = 'Sorcerer' and a.name in ('sorcerer_fight', 'sorcerer_defend', 'sorcerer_die')) or
  (c.name = 'Assassin' and a.name in ('assassin_fight', 'assassin_defend', 'assassin_die'));
