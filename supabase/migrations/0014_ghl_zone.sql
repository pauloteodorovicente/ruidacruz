-- Campo separado do "zone" de exibição — "zone" continua livre pro texto
-- bonito que aparece na página do imóvel (ex. "Matosinhos", "Algés"),
-- "ghl_zone" é restrito às zonas grandes já configuradas como dropdown
-- fechado no campo Zonas do GHL (confirmado via API, 13/08). Enviar o
-- "zone" livre direto pro GHL gerava valores soltos, sem bater com
-- nenhuma opção do dropdown.
alter table properties add column ghl_zone text;

update properties set ghl_zone = 'Sul' where reference = '122481641-31'; -- Cara de Pau, Tavira
update properties set ghl_zone = 'Sul' where reference = '122481641-32'; -- Vidigal Velho, Portimão
update properties set ghl_zone = 'Sul' where reference = '122481641-33'; -- Olival, Monchique
update properties set ghl_zone = 'Sintra' where reference = '122481641-34'; -- Massamá, Sintra
update properties set ghl_zone = 'Sul' where reference = '122481641-35'; -- Lagoa do Calvo, Palmela
update properties set ghl_zone = 'Sul' where reference = '122481641-36'; -- Carrasqueira, Palmela
update properties set ghl_zone = 'Mafra' where reference = '122481641-37'; -- Carrasqueira, Mafra
update properties set ghl_zone = 'Grande Porto' where reference = '122481641-38'; -- Leça do Balio, Matosinhos
update properties set ghl_zone = 'Lisboa' where reference = '122481641-39'; -- Marvila, Lisboa
update properties set ghl_zone = 'Oeiras e Carcavelos' where reference = '122481641-40'; -- Algés, Oeiras
update properties set ghl_zone = 'Sul' where reference = 'onegreenway'; -- Quinta do Lago, Loulé
update properties set ghl_zone = 'Sul' where reference = 'portimao-praia-da-rocha'; -- Praia da Rocha, Portimão
update properties set ghl_zone = 'Sul' where reference = 'verdelago'; -- Altura, Castro Marim
