-- "Arquivar" foto sem apagar (Fase pedida pelo Paulo, 24/08): esconder uma
-- foto da página pública sem perder o arquivo/registo, pra poder trazer de
-- volta depois sem reenviar. Default true — nenhuma foto existente muda de
-- comportamento com essa migração.
alter table property_photos add column visible boolean not null default true;
