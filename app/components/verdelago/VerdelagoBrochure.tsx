"use client";

import { useVerdelagoLanguage } from "@/lib/verdelago-language-context";
import { Reveal } from "../Reveal";

// ptHref/enHref: a página geral usa a brochura do empreendimento (padrão); a landing
// da Fase 6 passa os Documentos Comerciais da Fase 6 (enviados pelo Rui, 08/10).
export function VerdelagoBrochure({
  ptHref = "/docs/verdelago/Verdelago-Brochura-PT.pdf",
  enHref = "/docs/verdelago/Verdelago-Brochure-EN.pdf",
}: {
  ptHref?: string;
  enHref?: string;
}) {
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
            href={ptHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.1em] uppercase border border-accent text-accent px-4 py-2.5 transition-colors hover:bg-accent hover:text-background"
          >
            {b.label} PT
          </a>
          <a
            href={enHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.1em] uppercase border border-accent text-accent px-4 py-2.5 transition-colors hover:bg-accent hover:text-background"
          >
            {b.label} EN
          </a>
        </div>
      </Reveal>
    </section>
  );
}
