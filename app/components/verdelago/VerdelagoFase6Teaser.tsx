"use client";

import Link from "next/link";
import { useVerdelagoLanguage } from "@/lib/verdelago-language-context";
import { Reveal } from "../Reveal";

// Chamada curta na página geral do Verdelago (/verdelago) que leva à landing
// própria da Fase 6 (/verdelago6) — pedido do Paulo (08/10): a Fase 6 ganhou
// página à parte, e a página antiga só aponta pra ela. Textos nas 7 línguas em
// lib/verdelago-content.ts (bloco `fase6`).
export function VerdelagoFase6Teaser() {
  const { t } = useVerdelagoLanguage();
  const f = t.fase6;

  return (
    <section className="bg-background-raised border-y border-border border-t-2 border-t-accent px-6 py-8 md:px-12 md:py-10">
      <Reveal className="mx-auto max-w-6xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{f.eyebrow}</p>
          <h2 className="font-display text-2xl md:text-3xl leading-tight mb-2">{f.title}</h2>
          <p className="font-body text-foreground-muted leading-relaxed">{f.teaserText}</p>
        </div>
        <Link
          href="/verdelago6"
          className="shrink-0 self-start md:self-auto px-6 py-3.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          {f.teaserCta}
        </Link>
      </Reveal>
    </section>
  );
}
