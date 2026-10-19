-- Analytics de visitas da campanha Verdelago Fase 6 (pedido do Paulo, 18/10/2026).
--
-- leads.attribution: de onde veio o lead, em JSON {"utm_source","utm_medium","utm_campaign","ref"}
--   (primeira visita da sessão). Nulo = lead sem origem registrada (todos os anteriores).
-- events: índice por tipo e data, para o painel de Analytics filtrar por período sem varrer a
--   tabela inteira. Os dados novos (page_view, link_click, pdf_download) vão em events.meta.
--
-- Só adiciona uma coluna opcional e um índice: o código antigo continua funcionando.

alter table leads add column attribution jsonb;

create index if not exists events_type_created_idx on events (type, created_at desc);
