"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { Reveal } from "./Reveal";
import { RevealText } from "./RevealText";
import { LeadFormCompact } from "./LeadFormCompact";

export function PropertyIdentification() {
  const { t } = useLanguage();
  const i = t.identification;

  return (
    <section className="relative bg-background px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
        <Reveal className="md:col-span-3 block">
          <div className="flex gap-3 mb-6">
            {i.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] tracking-[0.12em] uppercase px-3 py-1 border border-border text-foreground-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <RevealText text={i.title} className="font-display text-4xl md:text-5xl leading-tight mb-6" />
          <p className="font-body text-lg text-foreground-muted leading-relaxed max-w-xl">
            {i.lede}
          </p>
        </Reveal>

        <Reveal className="md:col-span-2 block">
          <div className="md:sticky md:top-8 bg-background-raised border border-border border-t-2 border-t-accent p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
            <p className="font-display text-3xl mb-6">{i.price}</p>
            <dl className="grid grid-cols-2 gap-y-4 mb-8">
              {i.specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1">
                    {spec.label}
                  </dt>
                  <dd className="font-display text-lg">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex items-center gap-3 mb-8 pb-8 border-t border-border pt-6">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                <Image src="/images/rui/rui-cruz.jpg" alt={i.agentName} fill sizes="44px" className="object-cover" />
              </div>
              <div>
                <p className="font-display text-sm leading-tight">{i.agentName}</p>
                <p className="text-[11px] text-foreground-muted leading-tight">{i.agentTitle}</p>
              </div>
            </div>

            <p className="text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-3">
              {i.ctaPrimary}
            </p>
            <LeadFormCompact />

            <div className="flex items-center gap-3 my-5">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[10px] uppercase tracking-[0.1em] text-foreground-muted">
                {t.form.eyebrow === "Contacto" ? "ou" : "or"}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <a
              href={`https://wa.me/351939081583?text=${encodeURIComponent(t.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 border border-border text-center font-body text-sm tracking-[0.05em] uppercase transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              {i.ctaWhatsapp}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
