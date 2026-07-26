"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";

// Números genéricos/qualitativos por aval do Paulo (2026-07-26) — só "7 Anos"
// é um dado real confirmado; os outros dois evitam inventar volume/contagem
// até os números reais chegarem (ver Checklist Mestre).
export function CredibilityStrip() {
  const t = useTranslations("home.credibility");
  const items = t.raw("items") as { value: string; label: string }[];

  return (
    <section className="border-y border-border bg-background-raised px-6 py-10 md:px-12">
      <Reveal className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 block">
        {items.map((item) => (
          <div key={item.value} className="text-center md:text-left">
            <p className="font-display text-xl md:text-2xl text-accent">{item.value}</p>
            <p className="mt-1 text-sm text-foreground-muted">{item.label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
