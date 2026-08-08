"use client";

import { useOneGreenwayLanguage } from "@/lib/onegreenway-language-context";
import { Reveal } from "../Reveal";

export function OneGreenwayNarrative() {
  const { t } = useOneGreenwayLanguage();
  const n = t.narrative;

  return (
    <section className="px-6 pb-14 md:px-12 md:pb-20">
      <Reveal className="mx-auto max-w-4xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{n.eyebrow}</p>
        <div className="flex flex-col gap-4">
          {n.paragraphs.map((p) => (
            <p key={p} className="font-body text-base text-foreground-muted leading-relaxed max-w-2xl">
              {p}
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
