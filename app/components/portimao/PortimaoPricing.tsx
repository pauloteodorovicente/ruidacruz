"use client";

import { usePortimaoLanguage } from "@/lib/portimao-language-context";
import { Reveal } from "../Reveal";

export function PortimaoPricing() {
  const { t } = usePortimaoLanguage();
  const p = t.pricing;

  return (
    <section className="px-6 py-14 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-3xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{p.eyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-4">{p.title}</h2>
        <p className="text-sm text-foreground-muted mb-1">{p.availability}</p>
        <p className="text-sm text-foreground-muted mb-1">{p.checkIn}</p>
        <p className="text-sm text-foreground-muted mb-8">{p.checkOut}</p>

        <div className="border border-border">
          <div className="flex items-center justify-between px-5 py-2 border-b border-border text-[11px] uppercase tracking-[0.08em] text-foreground-muted/60">
            <span>{p.periodLabel}</span>
            <span>{p.priceLabel}</span>
          </div>
          {p.rows.map((row) => (
            <div key={row.period} className="flex items-center justify-between px-5 py-3.5 border-b border-border last:border-b-0 text-sm">
              <span className="text-foreground-muted">{row.period}</span>
              <span className="font-display text-accent">{row.price}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground-muted/70 mt-4">{p.note}</p>
      </Reveal>
    </section>
  );
}
