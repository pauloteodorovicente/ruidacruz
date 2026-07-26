"use client";

import { useLanguage } from "@/lib/language-context";
import { Reveal } from "@/app/components/Reveal";

export function SobreContent() {
  const { t } = useLanguage();
  const s = t.sobre;

  return (
    <Reveal className="block text-center">
      <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{s.eyebrow}</p>
      <h1 className="font-display text-3xl md:text-4xl mb-4">{s.title}</h1>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {s.credentials.map((c) => (
          <span key={c} className="text-[11px] tracking-[0.1em] uppercase px-3 py-1 border border-border text-foreground-muted">
            {c}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-5 text-left max-w-xl mx-auto">
        {s.paragraphs.map((p, i) => (
          <p key={i} className="font-body text-base md:text-lg leading-relaxed text-foreground-muted">
            {p}
          </p>
        ))}
        <p className="text-xs text-foreground-muted/60 italic mt-4">{s.pending}</p>
      </div>
    </Reveal>
  );
}
