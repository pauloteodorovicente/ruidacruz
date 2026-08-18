-- Paleta de cor por imóvel — 7 opções nomeadas (valores exatos claro/escuro
-- de cada uma vivem em lib/property-colors.ts, não no banco). Nulo = usa a
-- cor padrão do site (idêntico a escolher "terracota", só que sem gravar
-- nada extra) — os imóveis existentes continuam exatamente como estão.
alter table properties add column color_theme text
  check (color_theme in ('terracota', 'musgo', 'marinho', 'bordo', 'grafite', 'champanhe', 'creme'));
