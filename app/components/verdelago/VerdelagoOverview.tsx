"use client";

import Image from "next/image";
import { useVerdelagoLanguage } from "@/lib/verdelago-language-context";
import { Reveal } from "../Reveal";
import { RevealText } from "../RevealText";

export function VerdelagoOverview() {
  const { t } = useVerdelagoLanguage();
  const o = t.overview;

  function scrollToForm() {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative bg-background px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
        <Reveal className="md:col-span-3 block">
          <div className="flex gap-3 mb-6 flex-wrap">
            {o.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] tracking-[0.12em] uppercase px-3 py-1 border border-border text-foreground-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <RevealText text={o.title} className="font-display text-4xl md:text-5xl leading-tight mb-6" />
          <p className="font-body text-lg text-foreground-muted leading-relaxed max-w-xl">{o.lede}</p>
        </Reveal>

        <Reveal className="md:col-span-2 block">
          <div className="md:sticky md:top-8 bg-background-raised border border-border border-t-2 border-t-accent p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
            <p className="font-display text-3xl mb-1">{o.priceFrom}</p>
            <p className="text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-6">{o.priceNote}</p>
            <dl className="grid grid-cols-1 gap-y-5 mb-8">
              {o.specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1">
                    {spec.label}
                  </dt>
                  <dd className="font-display text-lg">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex items-center gap-3 mb-6 pb-6 border-t border-border pt-6">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                <Image src="/images/rui/rui-cruz.jpg" alt={o.agentName} fill sizes="44px" className="object-cover" />
              </div>
              <div>
                <p className="font-display text-sm leading-tight">{o.agentName}</p>
                <p className="text-[11px] text-foreground-muted leading-tight">{o.agentTitle}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={scrollToForm}
                className="w-full py-3.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                {o.ctaPrimary}
              </button>
              <a
                href={`https://wa.me/351939081583?text=${encodeURIComponent(t.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 border border-border text-center font-body text-sm tracking-[0.05em] uppercase transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                {o.ctaWhatsapp}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
