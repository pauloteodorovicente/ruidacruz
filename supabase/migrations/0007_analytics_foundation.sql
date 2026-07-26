-- Fase 6: base de dados pro dashboard de analytics. Duas peças:
-- 1) leads ganha status/error_message — hoje nada registrava sucesso/falha
--    de verdade, só ia pro GHL; sem isso não dá pra medir "Confiabilidade".
-- 2) tabela events genérica (tipo + metadados livres) pra cliques de
--    WhatsApp agora, e pageview/vídeo/galeria/planta mais adiante (Tráfego
--    e Engajamento) sem precisar reformular o schema de novo.

alter table leads add column status text not null default 'success' check (status in ('success', 'failed'));
alter table leads add column error_message text;

create table events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  property_id uuid references properties(id) on delete set null,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index events_type_idx on events(type);

alter table events enable row level security;
create policy "events_public_insert" on events for insert with check (true);
create policy "events_admin_read" on events for select using (auth.role() = 'authenticated');
