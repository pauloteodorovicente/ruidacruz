-- Super-Destaque dos cards, destaque de mídia na galeria e ordem das seções da ficha
-- (pedidos do Paulo, 18/10/2026).
--
-- card_highlight_color: paleta (slug, mesma lista de color_theme) do card em Super-Destaque
--   (properties.card_highlight, migração 0026). Nulo = cores padrão do site.
-- gallery_featured: mídia da galeria que ocupa o espaço de 4 (2x2): o id de uma foto
--   (property_photos.id, em texto) ou a palavra 'video' (o vídeo do Hero). Nulo = nenhuma.
-- gallery_video_in_grid: o vídeo do Hero também aparece como primeiro quadro da grade.
-- section_order: ordem das seções da ficha (ids: details, tour, architect, highlights,
--   location, gallery, floorplan). Nulo = ordem padrão do "Modelo da Página".
--
-- Só adiciona colunas opcionais: o código antigo continua funcionando contra este banco.

alter table properties
  add column card_highlight_color text
    check (card_highlight_color is null or card_highlight_color = any (array['terracota','musgo','marinho','bordo','grafite','champanhe','creme'])),
  add column gallery_featured text,
  add column gallery_video_in_grid boolean not null default false,
  add column section_order text[];
