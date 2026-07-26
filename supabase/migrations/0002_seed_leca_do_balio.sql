-- Primeiro registro real na tabela properties — a Leça do Balio, já publicada
-- na landing page. Alimenta a Coleção Curada da Home com dado de verdade em
-- vez de placeholder, e prova a ligação Home -> Supabase de ponta a ponta.

insert into properties (
  reference, title, property_type, typology, status, featured,
  zone, municipality, map_url,
  price, price_on_application, land_area_sqm, construction_area_sqm, parking, construction_year,
  description, highlights, architect, landscaper,
  layout_mode, layout_mode_overridden, source_locale
) values (
  '122481641-38', 'Moradia T5 Leça do Balio', 'moradia', 'T5', 'disponivel', true,
  'Matosinhos', 'Matosinhos', 'https://www.google.com/maps/search/?api=1&query=41.221706,-8.625612',
  1950000, false, 2545, 431, 'Box 2 + 2 exteriores', 2013,
  'Inserida na zona de proteção da Quinta do Chantre, esta moradia integra um loteamento privado e reservado de vinte residências.',
  array[
    'Tipologia T5 · 4 suítes + 1 quarto',
    'Loteamento fechado e reservado',
    'Arquitetura de autor · Manuel Ventura',
    '2.545 m² de terreno',
    'Ginásio privativo de 30 m²',
    'Sala multimédia e sala multiusos',
    'Piscina interior aquecida',
    'Jardim maduro e lago ornamental',
    'Garagem box para 2 viaturas + 2 lugares exteriores',
    'Construção de 2013',
    'A minutos do Porto e do Aeroporto Francisco Sá Carneiro'
  ],
  'Manuel Ventura', 'Marta Cudell',
  'arquitetura', false, 'pt-PT'
);
