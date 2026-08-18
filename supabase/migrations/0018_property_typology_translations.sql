-- Tradução por tipologia — achado migrando o One Green Way: ao contrário do
-- Verdelago (onde "T2A" é só um código técnico, não precisa traduzir), o
-- nome/descrição de cada grupo de tipologia do One Green Way são texto de
-- marketing de verdade, traduzido nos 7 idiomas hoje (hardcoded em
-- lib/onegreenway-content.ts). Mesmo padrão de property_translations:
-- translation_source 'human' nunca é sobrescrito por tradução automática.
create table property_typology_translations (
  id uuid primary key default gen_random_uuid(),
  typology_id uuid not null references property_typologies(id) on delete cascade,
  locale text not null,
  name text,
  description text,
  translation_source text not null default 'ai' check (translation_source in ('ai', 'human')),
  updated_at timestamptz not null default now(),
  unique (typology_id, locale)
);

alter table property_typology_translations enable row level security;

create policy "property_typology_translations_public_read" on property_typology_translations for select using (true);
create policy "property_typology_translations_admin_write" on property_typology_translations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
