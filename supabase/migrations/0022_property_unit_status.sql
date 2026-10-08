-- Estado por unidade/fração (pedido do Rui/Paulo, 08/10 — lançamento da Fase 6
-- do Verdelago): "vendido" aparece na tabela pública como Vendido (em vez de
-- sumir, o comprador vê que a fase tem unidades já vendidas), "oculto" tira a
-- unidade da página sem apagar o registo (ex.: frações que foram unidas numa
-- unidade maior) e dá pra voltar atrás pelo admin. Default 'disponivel' —
-- nenhuma unidade existente muda de comportamento com esta migração.
alter table property_units add column status text not null default 'disponivel';
alter table property_units add constraint property_units_status_check
  check (status in ('disponivel', 'vendido', 'oculto'));
