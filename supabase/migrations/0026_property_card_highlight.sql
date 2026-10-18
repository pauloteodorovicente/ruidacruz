-- Card em destaque visual (Backlog 15/10, item b).
--
-- card_highlight: o card do imóvel na Home e no Portfólio ganha selo "Em destaque"
--   e borda na cor de destaque. É independente de "featured" (que decide se o imóvel
--   aparece na coleção da Home). Falso por padrão.
--
-- Só adiciona uma coluna opcional: o código antigo, que não a conhece, continua
-- funcionando contra este banco.

alter table properties
  add column card_highlight boolean not null default false;
