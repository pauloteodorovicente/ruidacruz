-- Schema inicial do site completo (Fase 3 do roteiro).
-- 4 tabelas: properties, leads, testimonials, insights (nomes conforme o checklist mestre).

create extension if not exists "pgcrypto";

create table properties (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  title text not null,
  property_type text not null check (property_type in ('moradia', 'apartamento', 'terreno', 'outro')),
  typology text,
  status text not null default 'disponivel' check (status in ('disponivel', 'reservado', 'vendido', 'off_market')),
  featured boolean not null default false,

  zone text,
  municipality text,
  map_url text,

  price numeric,
  price_on_application boolean not null default false,
  land_area_sqm numeric,
  construction_area_sqm numeric,
  parking text,
  construction_year int,
  energy_certificate text check (energy_certificate in ('A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F')),

  description text,
  highlights text[] not null default '{}',
  architect text,
  landscaper text,

  -- Modo de layout: regra automática recomenda, Rui pode sobrescrever via checkbox no painel.
  layout_mode text not null default 'urbano' check (layout_mode in ('arquitetura', 'paisagem_terreno', 'urbano')),
  layout_mode_overridden boolean not null default false,

  source_locale text not null default 'pt-PT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table property_photos (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  storage_path text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index property_photos_property_id_idx on property_photos(property_id);

-- Texto traduzido por idioma. Populado por IA na publicação; translation_source
-- vira 'human' se o Rui editar manualmente aquele idioma específico (opt-in dele).
create table property_translations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  locale text not null check (locale in ('pt-PT', 'pt-BR', 'en', 'es', 'fr', 'it', 'de')),
  title text,
  description text,
  highlights text[] not null default '{}',
  translation_source text not null default 'ai' check (translation_source in ('ai', 'human')),
  updated_at timestamptz not null default now(),
  unique (property_id, locale)
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text,
  property_id uuid references properties(id) on delete set null,
  source text,
  ghl_contact_id text,
  created_at timestamptz not null default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  quote text not null,
  rating numeric,
  source text,
  featured boolean not null default true,
  created_at timestamptz not null default now()
);

-- Relatório de Inteligência (IA) — schema pronto, sem UI/lógica ainda (fase avaliada por último).
create table insights (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  content text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  generated_at timestamptz not null default now(),
  published_at timestamptz
);

-- RLS: leitura pública do que é destinado ao site; escrita só para usuários autenticados
-- (login do painel é por convite direto no Supabase Auth — só Paulo e Rui, sem cadastro aberto).

alter table properties enable row level security;
alter table property_photos enable row level security;
alter table property_translations enable row level security;
alter table leads enable row level security;
alter table testimonials enable row level security;
alter table insights enable row level security;

create policy "properties_public_read" on properties for select using (status <> 'off_market' or auth.role() = 'authenticated');
create policy "properties_admin_write" on properties for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "property_photos_public_read" on property_photos for select using (true);
create policy "property_photos_admin_write" on property_photos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "property_translations_public_read" on property_translations for select using (true);
create policy "property_translations_admin_write" on property_translations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Leads: qualquer visitante pode criar (envio de formulário), ninguém de fora pode ler.
create policy "leads_public_insert" on leads for insert with check (true);
create policy "leads_admin_read" on leads for select using (auth.role() = 'authenticated');

create policy "testimonials_public_read" on testimonials for select using (true);
create policy "testimonials_admin_write" on testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "insights_public_read_published" on insights for select using (status = 'published' or auth.role() = 'authenticated');
create policy "insights_admin_write" on insights for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
