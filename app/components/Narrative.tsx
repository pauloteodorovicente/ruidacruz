"use client";

import { useLanguage } from "@/lib/language-context";

export function Narrative() {
  const { t } = useLanguage();
  const n = t.narrative;

  return (
    <section className="bg-background px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-6">{n.eyebrow}</p>
        <div className="flex flex-col gap-6">
          {n.paragraphs.map((p, idx) => (
            <p key={idx} className="font-body text-base md:text-lg leading-relaxed text-foreground-muted">
              {p}
            </p>
          ))}
        </div>
        <p className="font-display text-xl md:text-2xl mt-10 italic">{n.closing}</p>
      </div>
    </section>
  );
}
