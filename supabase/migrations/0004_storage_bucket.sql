-- Bucket público de fotos dos imóveis (Fase 3/6). Leitura pública (as fotos
-- aparecem no site pra qualquer visitante); escrita só acontece via Server
-- Action do painel usando a service role key, que já bypassa RLS/storage
-- policies — as políticas abaixo são a segunda camada de defesa, não a única.

insert into storage.buckets (id, name, public)
values ('property-photos', 'property-photos', true)
on conflict (id) do nothing;

create policy "property_photos_bucket_public_read"
on storage.objects for select
using (bucket_id = 'property-photos');

create policy "property_photos_bucket_admin_write"
on storage.objects for insert
with check (bucket_id = 'property-photos' and auth.role() = 'authenticated');

create policy "property_photos_bucket_admin_delete"
on storage.objects for delete
using (bucket_id = 'property-photos' and auth.role() = 'authenticated');
