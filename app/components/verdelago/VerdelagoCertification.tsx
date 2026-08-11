"use client";

import { useVerdelagoLanguage } from "@/lib/verdelago-language-context";
import { Reveal } from "../Reveal";

// "Green Globe"/"Green Key" são nomes próprios de certificação, universais
// nas 7 línguas — não traduzidos de propósito.
export function VerdelagoCertification() {
  const { t } = useVerdelagoLanguage();
  const cert = t.certification;

  return (
    <section className="bg-background px-6 py-10 md:px-12 md:py-14">
      <Reveal className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center gap-6 border border-border px-8 py-8 text-center sm:text-left">
        <div className="flex gap-4 shrink-0">
          {cert.badges.map((badge) => (
            <span key={badge} className="text-[11px] tracking-[0.1em] uppercase border border-accent text-accent px-3 py-1.5">
              {badge}
            </span>
          ))}
        </div>
        <p className="text-sm text-foreground-muted leading-relaxed">{cert.text}</p>
      </Reveal>
    </section>
  );
}
