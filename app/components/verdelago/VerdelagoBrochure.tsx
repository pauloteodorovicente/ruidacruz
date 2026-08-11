"use client";

import { useVerdelagoLanguage } from "@/lib/verdelago-language-context";
import { Reveal } from "../Reveal";

export function VerdelagoBrochure() {
  const { t } = useVerdelagoLanguage();
  const b = t.brochure;

  return (
    <section className="bg-background-raised px-6 py-10 md:px-12 md:py-14 border-y border-border">
      <Reveal className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{b.eyebrow}</p>
          <p className="text-sm text-foreground-muted leading-relaxed">{b.text}</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <a
            href="/docs/verdelago/Verdelago-Brochura-PT.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.1em] uppercase border border-accent text-accent px-4 py-2.5 transition-colors hover:bg-accent hover:text-background"
          >
            Brochura PT
          </a>
          <a
            href="/docs/verdelago/Verdelago-Brochure-EN.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.1em] uppercase border border-accent text-accent px-4 py-2.5 transition-colors hover:bg-accent hover:text-background"
          >
            Brochure EN
          </a>
        </div>
      </Reveal>
    </section>
  );
}
