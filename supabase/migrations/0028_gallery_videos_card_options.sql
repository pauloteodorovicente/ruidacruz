-- Vídeos na galeria e opções do Super-Destaque (ajustes da Conferência, 18/10/2026).
--
-- property_photos.media_type: 'image' (padrão) ou 'video'. Um vídeo da galeria é uma linha
--   como as fotos (mesma ordem, arquivar e destacar); capas e carrossel dos cards só usam
--   imagens.
-- properties.card_highlight_options: o que o Super-Destaque do card tem, em JSON
--   {"badge":true,"taller":true,"border":true,"pulse":false}. Nulo = os padrões (selo, mais
--   alto e borda ligados; animação desligada).
--
-- Só adiciona colunas com valor padrão: o código antigo continua funcionando contra este banco.

alter table property_photos
  add column media_type text not null default 'image' check (media_type in ('image', 'video'));

alter table properties
  add column card_highlight_options jsonb;
