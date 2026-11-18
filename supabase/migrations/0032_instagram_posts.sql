-- Instagram na Home (Fase 27): posts escolhidos à mão no admin, sem API do Instagram.
-- Cada linha é uma publicação em destaque: a imagem (enviada pelo admin para o Storage),
-- o link do post/reel no Instagram e uma legenda curta opcional. A ordem, a visibilidade,
-- o layout (galeria ou carrossel) e o limite de posts vivem em settings.instagram_section.
-- Só cria coisas novas: o código antigo, que não conhece esta tabela, continua igual.
create table instagram_posts (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  post_url text not null,
  caption text,
  is_video boolean not null default false,
  position integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index instagram_posts_position_idx on instagram_posts (position);

alter table instagram_posts enable row level security;

-- Visitante vê só o que está visível; o admin (autenticado) vê e altera tudo.
create policy "instagram_posts_public_read" on instagram_posts for select using (visible = true or auth.role() = 'authenticated');
create policy "instagram_posts_admin_write" on instagram_posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
