-- Hero configurável da Home — Paulo/Rui podem trocar a capa (foto única,
-- mosaico de até 5 fotos, ou vídeo) direto no painel, sem precisar de mim
-- pra mexer no código. Singleton (uma linha só) por simplicidade — não há
-- necessidade de histórico/versões por ora.
create table home_hero (
  id uuid primary key default gen_random_uuid(),
  media_type text not null default 'video' check (media_type in ('image', 'video')),
  layout text not null default 'single' check (layout in ('single', 'duo', 'trio', 'quad', 'penta')),
  items jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

alter table home_hero enable row level security;

create policy "home_hero_public_read" on home_hero for select using (true);
create policy "home_hero_admin_write" on home_hero for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Bucket público pra mídia do hero enviada direto (upload do computador),
-- sem vínculo com nenhum imóvel — separado de property-photos de propósito.
insert into storage.buckets (id, name, public)
values ('hero-media', 'hero-media', true)
on conflict (id) do nothing;

create policy "hero_media_bucket_public_read"
on storage.objects for select
using (bucket_id = 'hero-media');

create policy "hero_media_bucket_admin_write"
on storage.objects for insert
with check (bucket_id = 'hero-media' and auth.role() = 'authenticated');

create policy "hero_media_bucket_admin_delete"
on storage.objects for delete
using (bucket_id = 'hero-media' and auth.role() = 'authenticated');
