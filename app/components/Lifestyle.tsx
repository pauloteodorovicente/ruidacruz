"use client";

import { useLanguage } from "@/lib/language-context";
import { Reveal } from "./Reveal";

export function Lifestyle() {
  const { t } = useLanguage();
  const l = t.lifestyle;

  return (
    <section className="bg-background-raised px-6 py-14 md:px-12 md:py-20 border-y border-border">
      <Reveal className="mx-auto max-w-3xl block text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{l.eyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-6">{l.title}</h2>
        <p className="font-body text-base md:text-lg text-foreground-muted leading-relaxed mb-10">{l.intro}</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-left max-w-xl mx-auto">
          {l.moments.map((m) => (
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
