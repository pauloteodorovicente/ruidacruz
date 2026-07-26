-- Modo de pré-visualização (Fase 6): imóveis novos nascem "published = false"
-- (rascunho, só visível no painel), e só aparecem no site público depois que
-- o Rui/Paulo decide publicar. Ajusta a política de leitura pública de
-- properties pra também exigir published = true.

alter table properties add column published boolean not null default false;

-- A Leça do Balio já está no ar hoje — marca como publicada pra não sumir do site.
update properties set published = true where reference = '122481641-38';

drop policy if exists "properties_public_read" on properties;
create policy "properties_public_read" on properties
  for select using (published = true and status <> 'off_market' or auth.role() = 'authenticated');
