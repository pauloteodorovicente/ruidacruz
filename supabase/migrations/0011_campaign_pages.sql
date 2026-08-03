-- Leça do Balio e Verdelago passam a existir também como registos em
-- properties — só para aparecerem no Admin e terem "published" controlando
-- a visibilidade real da página. O conteúdo rico (narrativa, comodidades,
-- galeria, plantas) continua a viver no código (lib/content.ts /
-- lib/verdelago-content.ts), não neste registo: casos assim ganham
-- is_campaign_page = true, e o admin mostra um editor reduzido (só
-- published, não o formulário genérico de imóvel) apontando pra
-- campaign_path.

alter table properties add column is_campaign_page boolean not null default false;
alter table properties add column campaign_path text;

update properties
  set is_campaign_page = true, campaign_path = '/leca-do-balio'
  where reference = '122481641-38';

insert into properties (
  reference, title, property_type, typology, status, featured,
  zone, municipality,
  price, price_on_application,
  description, highlights,
  layout_mode, layout_mode_overridden, source_locale,
  published, is_campaign_page, campaign_path
) values (
  'verdelago', 'Verdelago Resort', 'apartamento', 'T2/T3', 'disponivel', false,
  'Altura, Algarve', 'Castro Marim',
  880000, false,
  'Apartamentos T2 e T3 no Verdelago Resort, um empreendimento turístico de 5 estrelas entre Altura e a Praia Verde, Algarve.',
  array['Resort 5 Estrelas', 'Acesso Direto à Praia', 'SPA & Wellness', 'Elegível para NHR'],
  'urbano', false, 'pt-PT',
  true, true, '/verdelago'
);
