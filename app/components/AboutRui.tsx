"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { Reveal } from "./Reveal";

// Teaser da home — a biografia completa (real, ainda pendente com o Rui) vai
// pra /sobre na Fase 7. O link abaixo aponta pra lá mesmo antes de existir;
// tudo bem por ora, o branch inteiro ainda não está publicado.
export function AboutRui() {
  const { t } = useLanguage();
  const a = t.home.about;

  return (
    <section className="bg-background-raised px-6 py-14 md:px-12 md:py-20 border-y border-border">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,220px)_1fr] md:gap-14">
        <Reveal className="block">
          <div className="relative mx-auto aspect-[3/4] w-40 overflow-hidden md:w-full">
            <Image
              src="/images/rui/hero-portrait.jpg"
              alt={a.title}
              fill
              sizes="(max-width: 768px) 160px, 220px"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal className="block">
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{a.eyebrow}</p>
          <h2 className="font-display text-2xl md:text-3xl mb-4">{a.title}</h2>
          <p className="text-foreground-muted leading-relaxed max-w-lg">{a.text}</p>
          <a
            href="/sobre"
            className="mt-6 inline-block text-sm tracking-[0.05em] uppercase text-accent border-b border-accent pb-0.5 hover:text-accent-strong transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
          >
            {a.cta} →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
