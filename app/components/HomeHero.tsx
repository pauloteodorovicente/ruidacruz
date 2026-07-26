"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";
import { RevealText } from "./RevealText";

// Hero da home institucional — distinto do hero em vídeo da Leça do Balio
// (essa é sobre o Rui, não sobre um imóvel específico). Mantém o mesmo
// data-hero-wrapper pro SiteHeader adaptativo continuar funcionando aqui também.
export function HomeHero() {
  const h = useTranslations("home.hero");

  return (
    <div data-hero-wrapper className="relative">
      <section className="grid min-h-[85vh] grid-cols-1 md:grid-cols-2">
        <div className="relative order-2 flex flex-col justify-center gap-6 bg-background px-6 py-16 md:order-1 md:px-12 lg:px-16">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-4">{h("eyebrow")}</p>
          </Reveal>
          <RevealText text={h("title")} className="font-display text-3xl leading-tight md:text-4xl lg:text-5xl" />
          <Reveal className="block max-w-md">
            <p className="mt-2 text-foreground-muted">{h("subtitle")}</p>
          </Reveal>
          <Reveal className="block">
            <div className="mt-4 flex flex-wrap gap-4">
              <a
                href="#colecao"
                className="border border-border px-6 py-3 text-sm tracking-[0.08em] uppercase text-foreground transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                {h("ctaPrimary")}
              </a>
              <a
                href="#contacto"
                className="px-6 py-3 text-sm tracking-[0.08em] uppercase text-foreground-muted transition-all hover:text-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                {h("ctaSecondary")}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="relative order-1 h-[45vh] md:order-2 md:h-auto">
          <Image
            src="/images/rui/hero-portrait.jpg"
            alt="Rui Da Cruz"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>
    </div>
  );
}
