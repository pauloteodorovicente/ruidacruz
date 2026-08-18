"use client";

import { useVerdelagoLanguage } from "@/lib/verdelago-language-context";
import { Reveal } from "../Reveal";

// Conteúdo vem do documento comercial oficial (valores em €/CPCV/escritura
// mantêm-se iguais nas 7 línguas, só o texto ao redor é traduzido).
export function VerdelagoInvestment() {
  const { t } = useVerdelagoLanguage();
  const inv = t.investment;

  return (
    <section className="bg-background px-6 py-14 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-5xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{inv.eyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-10">{inv.title}</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {inv.items.map((item) => (
            <div key={item.title} className="border-t border-accent pt-5">
              <p className="font-display text-lg mb-2">{item.title}</p>
              <p className="text-sm text-foreground-muted leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
