-- Lista de quem cancelou a subscrição dos e-mails enviados pelo Rui (link
-- "cancele a subscrição" no rodapé — pedido do Paulo, 08/10). Chave = e-mail em
-- minúsculas. Só o servidor (service role) lê e escreve: RLS ligada e sem
-- nenhuma policy, então a chave pública nunca enxerga essa lista. Todo envio
-- em massa tem que consultar esta tabela antes de enviar.
create table email_unsubscribes (
  email text primary key,
  source text,
  created_at timestamptz not null default now(),
  constraint email_unsubscribes_email_lower check (email = lower(email))
);

alter table email_unsubscribes enable row level security;
