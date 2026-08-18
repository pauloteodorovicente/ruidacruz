-- Empreendimentos multi-unidade (Fase 23) — tipologias com faixa de preço,
-- plantas por tipologia, e (opcional) a lista granular de unidades/frações
-- de verdade quando existir (caso do Verdelago). Nem todo empreendimento
-- precisa da granularidade de unidade — o One Green Way, por exemplo, só
-- tem 2 grupos de tipologia com um preço "a partir de", sem lista de
-- frações — por isso property_units é opcional (typology_id pode ficar
-- sem nenhuma unidade associada).
create table property_typologies (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  name text not null,
  description text,
  price_from numeric,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table property_typology_floorplans (
  id uuid primary key default gen_random_uuid(),
  typology_id uuid not null references property_typologies(id) on delete cascade,
  storage_path text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- Unidade/fração individual — lote+fração+preço, como a planilha real do
-- Verdelago (58 frações hoje, hardcoded em lib/verdelago-units.ts até essa
-- migração; passa a viver aqui, editável pelo admin). typology_id fica nulo
-- se a unidade ainda não tiver tipologia atribuída.
create table property_units (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  typology_id uuid references property_typologies(id) on delete set null,
  phase_label text,
  lot text,
  fraction text,
  price numeric,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table property_typologies enable row level security;
alter table property_typology_floorplans enable row level security;
alter table property_units enable row level security;

create policy "property_typologies_public_read" on property_typologies for select using (true);
create policy "property_typologies_admin_write" on property_typologies for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "property_typology_floorplans_public_read" on property_typology_floorplans for select using (true);
create policy "property_typology_floorplans_admin_write" on property_typology_floorplans for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "property_units_public_read" on property_units for select using (true);
create policy "property_units_admin_write" on property_units for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
