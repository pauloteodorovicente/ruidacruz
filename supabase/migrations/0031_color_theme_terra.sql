-- Nova paleta "terra" (Terracota terrosa, 19/10/2026): as colunas de cor aceitam o novo valor.
-- O valor "terracota" continua existindo e significa o padrão do site (Clássico, marinho e cobre).
-- Só amplia a lista de valores aceitos: o código antigo continua funcionando contra este banco.

alter table properties drop constraint properties_color_theme_check;
alter table properties add constraint properties_color_theme_check
  check (color_theme is null or color_theme = any (array['terracota','terra','musgo','marinho','bordo','grafite','champanhe','creme']));

alter table properties drop constraint properties_card_highlight_color_check;
alter table properties add constraint properties_card_highlight_color_check
  check (card_highlight_color is null or card_highlight_color = any (array['terracota','terra','musgo','marinho','bordo','grafite','champanhe','creme']));
