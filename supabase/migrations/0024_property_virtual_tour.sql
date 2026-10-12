-- Visita virtual 360° (Floorfy, Matterport, Kuula...) por imóvel — pedido do Rui
-- (07/10) pro apartamento T2 da Morais Soares: a ficha ganha uma seção em
-- destaque com a visita incorporada. Opcional (null = sem visita); só https://.
alter table properties add column virtual_tour_url text;
alter table properties add constraint properties_virtual_tour_url_check
  check (virtual_tour_url is null or virtual_tour_url ~ '^https://[^[:space:]]+$');
