-- Fotos da Leça do Balio na tabela property_photos, pra alimentar a galeria
-- genérica de verdade (mesmas imagens já usadas na landing page estática).
-- Quando o upload no painel (Fase 6) existir, storage_path passa a apontar
-- pro Supabase Storage em vez de /public — o componente não muda.

insert into property_photos (property_id, storage_path, position)
select id, photo.path, photo.position
from properties, (values
  ('/images/leca-do-balio/01-hero-fachada.jpg', 0),
  ('/images/leca-do-balio/02-aereo-enclave.jpg', 1),
  ('/images/leca-do-balio/07-terraco-coberto.jpg', 2),
  ('/images/leca-do-balio/05-aereo-piscina.jpg', 3),
  ('/images/leca-do-balio/09-cozinha.jpg', 4),
  ('/images/leca-do-balio/11-ponte-lago.jpg', 5),
  ('/images/leca-do-balio/08-terraco-rooftop.jpg', 6),
  ('/images/leca-do-balio/04-aereo-lago.jpg', 7),
  ('/images/leca-do-balio/10-garagem.jpg', 8),
  ('/images/leca-do-balio/03-aereo-localizacao.jpg', 9),
  ('/images/leca-do-balio/06-aereo-terraco.jpg', 10),
  ('/images/leca-do-balio/12-corredor-vidro.jpg', 11)
) as photo(path, position)
where properties.reference = '122481641-38';
