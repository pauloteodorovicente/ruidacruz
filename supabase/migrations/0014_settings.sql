-- Configurações de integrações (Meta Pixel, GoHighLevel, futuras) editáveis
-- pelo admin sem precisar mexer em código — Fase 16 do checklist. Uma linha
-- por integração, chave livre, valor em jsonb (schema flexível por chave) —
-- assim uma integração nova entra sem migração nova.
create table settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table settings enable row level security;

-- Leitura pública de tudo, exceto a chave "ghl" — o token de API do GHL não
-- pode nunca chegar ao navegador. Ela só é lida via admin client (service
-- role, bypassa RLS) em contexto de servidor.
create policy "settings_public_read" on settings for select using (key <> 'ghl');
create policy "settings_admin_write" on settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
