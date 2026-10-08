"use client";

import Image from "next/image";
import { useVerdelagoLanguage } from "@/lib/verdelago-language-context";
import { Reveal } from "../Reveal";
import { RevealText } from "../RevealText";

// Faixa de lançamento da Fase 6 (pedido do Rui, 30/09–02/10): texto dele,
// traduzido nas 7 línguas em lib/verdelago-content.ts (bloco `fase6`). Os
// números vêm do banco via app/verdelago/page.tsx (total de frações da fase e
// quantas seguem disponíveis), então acompanham o que o admin marcar como
// vendido/oculto — e a página não renderiza esta faixa quando a fase esgota.
export function VerdelagoFase6({ total, available }: { total: number; available: number }) {
  const { t } = useVerdelagoLanguage();
  const f = t.fase6;

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="fase-6"
      className="relative bg-background-raised border-y border-border border-t-2 border-t-accent px-6 py-14 md:px-12 md:py-20"
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16 items-start">
        <Reveal className="md:col-span-3 block">
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-3">{f.eyebrow}</p>
          <RevealText text={f.title} className="font-display text-4xl md:text-5xl leading-tight mb-4" />
          <p className="font-display text-xl text-accent mb-8">{f.subtitle}</p>

          <p className="font-body text-lg text-foreground-muted leading-relaxed mb-4 max-w-2xl">{f.p1}</p>
          <p className="font-body text-foreground-muted leading-relaxed mb-8 max-w-2xl">{f.p2}</p>

          <h3 className="font-display text-xl mb-2">{f.h1}</h3>
          <p className="font-body text-foreground-muted leading-relaxed mb-3 max-w-2xl">{f.p3}</p>
          <p className="font-body text-foreground-muted leading-relaxed mb-8 max-w-2xl">{f.p4}</p>

          <h3 className="font-display text-xl mb-2">{f.h2}</h3>
          <p className="font-body text-foreground-muted leading-relaxed mb-3 max-w-2xl">{f.p5}</p>
          <p className="font-body text-foreground-muted leading-relaxed mb-3 max-w-2xl">{f.p6}</p>
          <p className="font-body text-foreground-muted leading-relaxed mb-8 max-w-2xl">{f.p7}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => scrollTo("unidades")}
              className="px-6 py-3.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              {f.ctaUnits}
            </button>
            <button
              onClick={() => scrollTo("contacto")}
              className="px-6 py-3.5 border border-border font-body text-sm tracking-[0.05em] uppercase transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              {f.ctaContact}
            </button>
          </div>
        </Reveal>

        <Reveal className="md:col-span-2 block">
          <div className="md:sticky md:top-8">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/verdelago/05-spa.jpg"
                alt={f.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                quality={90}
                className="object-cover"
              />
            </div>
            <dl className="grid grid-cols-2 border border-t-0 border-border bg-background">
              <div className="p-5 border-r border-border">
                <dd className="font-display text-4xl text-accent leading-none mb-2">{available}</dd>
                <dt className="text-[11px] tracking-[0.1em] uppercase text-foreground-muted">{f.statAvailable}</dt>
              </div>
              <div className="p-5">
                <dd className="font-display text-4xl leading-none mb-2">{total}</dd>
                <dt className="text-[11px] tracking-[0.1em] uppercase text-foreground-muted">{f.statTotal}</dt>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
