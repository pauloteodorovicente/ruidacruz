-- URL amigável por imóvel (pedido do Paulo, 24/09): hoje a ficha genérica vive em
-- /imoveis/{referencia}, e a referência é o número da REMAX (ex. 122481641-78) —
-- é ela que aparece como "Ref." pro comprador e vai pro lead/GHL, então não
-- pode virar texto de URL. O slug é um campo à parte, opcional: quando existe,
-- é o endereço oficial da ficha (/imoveis/{slug}) e a URL antiga pela
-- referência redireciona pra ele; quando é null, nada muda pro imóvel.
alter table properties add column slug text;
alter table properties add constraint properties_slug_format_check
  check (slug is null or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
create unique index properties_slug_key on properties (slug) where slug is not null;
