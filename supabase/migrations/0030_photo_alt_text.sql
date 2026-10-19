-- Legenda (texto alternativo) por foto, por idioma (fotos das landings no banco, 19/10/2026).
--
-- alt_text: {"pt-PT": "...", "en": "...", ...} usado como descrição acessível da foto na galeria.
--   Nulo = a galeria usa uma descrição padrão da página.
--
-- Só adiciona uma coluna opcional: o código antigo continua funcionando contra este banco.

alter table property_photos add column alt_text jsonb;
