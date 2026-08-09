-- Link de pré-visualização temporário — permite mostrar um rascunho a um
-- cliente sem precisar de login no admin. Token único por imóvel (gerar de
-- novo invalida o anterior), expira sozinho depois de 48h (checado na
-- leitura, não precisa de job/cron pra limpar).
alter table properties add column preview_token text;
alter table properties add column preview_token_expires_at timestamptz;

create unique index properties_preview_token_idx on properties (preview_token) where preview_token is not null;
