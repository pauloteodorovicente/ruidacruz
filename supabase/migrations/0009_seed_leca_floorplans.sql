-- Semeia as plantas já publicadas na landing estática (FloorPlan.tsx),
-- pra Leça do Balio ter dado real na nova tabela genérica também.

insert into property_floorplans (property_id, storage_path, floor_label, position)
select id, plan.path, plan.label, plan.position
from properties, (values
  ('/images/leca-do-balio/planta/res-do-chao.jpg', 'Rés-do-Chão', 0),
  ('/images/leca-do-balio/planta/piso1-andar.jpg', '1º Andar', 1)
) as plan(path, label, position)
where properties.reference = '122481641-38';
