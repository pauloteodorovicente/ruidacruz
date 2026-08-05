-- Hero configurável por imóvel — mesma ideia do home_hero (Fase Hero da
-- Home), mas um registo por property_id em vez de singleton. Sem
-- configuração aqui, a página do imóvel continua usando o PropertyHero
-- simples (primeira foto), sem quebrar nada do que já existe.

create table property_hero (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null unique references properties(id) on delete cascade,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  layout text not null default 'single' check (layout in ('single', 'duo', 'trio', 'quad', 'penta')),
  items jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

alter table property_hero enable row level security;

create policy "property_hero_public_read" on property_hero for select using (true);
create policy "property_hero_admin_write" on property_hero for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
