-- Capa explícita por imóvel + exceção do carrossel de capas (Saídas C-1 e C-3, 12/10/2026).
--
-- cover_photo_id: qual foto é a capa do imóvel (cards da Home/Portfólio, Hero da
--   ficha quando não há hero próprio, prévia de link). Nulo = não definida: vale a
--   primeira foto visível (por posição) — o comportamento de sempre, então NÃO precisa
--   de backfill. Se a foto for apagada, volta a nulo sozinha.
-- cover_carousel: exceção por imóvel do carrossel automático das capas. Nulo = segue
--   o padrão do site (settings.card_carousel); true/false força ligado/desligado.
--
-- Só adiciona colunas opcionais: o código antigo (que não conhece nenhuma das duas)
-- continua funcionando contra este banco.

alter table properties
  add column cover_photo_id uuid references property_photos (id) on delete set null,
  add column cover_carousel boolean;
