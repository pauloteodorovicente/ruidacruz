"use client";

import { Reveal } from "../Reveal";

// Componente de avaliação (preview) — texto só em PT-PT por ora, ainda não
// aprovado pro Verdelago real. Conteúdo vem do documento comercial oficial.
export function VerdelagoInvestment() {
  return (
    <section className="bg-background px-6 py-14 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-5xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">Investimento</p>
        <h2 className="font-display text-3xl md:text-4xl mb-10">Uma aquisição pensada para render</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="border-t border-accent pt-5">
            <p className="font-display text-lg mb-2">Residente Não Habitual</p>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Portugal oferece um regime fiscal vantajoso para novos residentes — condições a confirmar com o seu
              consultor fiscal, mas um fator relevante para quem considera o Algarve como base.
            </p>
          </div>
          <div className="border-t border-accent pt-5">
            <p className="font-display text-lg mb-2">Programa de Arrendamento</p>
            <p className="text-sm text-foreground-muted leading-relaxed">
              75% da receita líquida de arrendamento fica com o proprietário; os restantes 25% cobrem a gestão da
              entidade exploradora do resort — sem preocupação operacional da sua parte.
            </p>
          </div>
          <div className="border-t border-accent pt-5">
            <p className="font-display text-lg mb-2">Estrutura de Pagamento</p>
            <p className="text-sm text-foreground-muted leading-relaxed">
              25.000 € de reserva, 25% na assinatura do CPCV, 35% na conclusão da estrutura, e os restantes 40% na
              escritura pública.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
