-- Diferenciar venda de arrendamento — hoje o preço é só um número, sem
-- distinguir se é um valor de venda ou uma renda mensal. Pedido do Paulo em
-- 07/08 depois de perceber que os 2 rascunhos de arrendamento (Algés,
-- Marvila) ficavam ambíguos ("1.500 €" parece erro de preço de venda).
create type business_type as enum ('venda', 'arrendamento');

alter table properties add column business_type business_type not null default 'venda';

update properties set business_type = 'arrendamento'
  where reference in ('122481641-40', '122481641-39');
