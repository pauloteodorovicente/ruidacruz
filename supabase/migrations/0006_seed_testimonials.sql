-- Semeia os 2 depoimentos reais já publicados na landing page estática, pra
-- Fase 6 (gestão de depoimentos no painel) ter dado de verdade pra editar,
-- em vez de nascer vazia.

insert into testimonials (author_name, quote, source, featured) values
(
  'Isabel Da Silva',
  'Tive o prazer de trabalhar com o Rui da Cruz durante mais de quatro anos e posso dizer, com toda a sinceridade, que não confiaria as minhas necessidades imobiliárias em Portugal a mais ninguém. A viver no Canadá, a gestão à distância poderia ter sido complicada — mas a sua dedicação e apoio constante tornaram todo o processo simples e tranquilo.',
  'Google',
  true
),
(
  'Eduardo Lacerda',
  'Um ótimo profissional que sabe do que fala. Sem a ajuda do Rui o meu negócio não teria sido possível, e certamente teria perdido o meu depósito do CPCV.',
  'Google',
  true
);
