"use client";

import { Reveal } from "../Reveal";

const MOMENTS = [
  "Cocktails de assinatura ao entardecer",
  "Praia protegida, a poucos passos de casa",
  "Kids Club para as manhãs mais tranquilas",
  "Tratamentos de wellness sob medida",
  "Pool Club e Beach Club",
  "Desporto ao ar livre, todo o ano",
];

// Componente de avaliação (preview) — texto só em PT-PT por ora.
export function VerdelagoLifestyle() {
  return (
    <section className="bg-background-raised px-6 py-14 md:px-12 md:py-20 border-y border-border">
      <Reveal className="mx-auto max-w-3xl block text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">Viver no Verdelago</p>
        <h2 className="font-display text-3xl md:text-4xl mb-6">Onde a vida é feita de pequenos momentos</h2>
        <p className="font-body text-base md:text-lg text-foreground-muted leading-relaxed mb-10">
          Mais do que uma morada, o Verdelago propõe um ritmo — entre a praia, a piscina e o verde envolvente, cada
          dia encontra o seu próprio momento de pausa.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-left max-w-xl mx-auto">
          {MOMENTS.map((m) => (
            <li key={m} className="font-body text-sm text-foreground flex items-start gap-3">
              <span className="text-accent mt-1">—</span>
              {m}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
