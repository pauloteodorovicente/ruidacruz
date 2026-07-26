-- Plantas do imóvel (Fase 5/6): faltava tanto a tabela quanto a seção
-- genérica no site — a Leça do Balio hoje usa um componente fixo com
-- exatamente 2 pisos hardcoded (FloorPlan.tsx). Isso generaliza pra
-- qualquer nº de pisos (ou nenhum, se o imóvel não tiver planta ainda).

create table property_floorplans (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  storage_path text not null,
  floor_label text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index property_floorplans_property_id_idx on property_floorplans(property_id);

alter table property_floorplans enable row level security;
create policy "property_floorplans_public_read" on property_floorplans for select using (true);
create policy "property_floorplans_admin_write" on property_floorplans for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Mesmo bucket das fotos, pasta separada por convenção de path (property-floorplans/{property_id}/...).
