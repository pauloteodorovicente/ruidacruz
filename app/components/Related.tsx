"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Reveal } from "./Reveal";

export function Related() {
  const { t } = useLanguage();
  const r = t.related;

  return (
    <section className="bg-background-raised px-6 py-14 md:px-12 md:py-20 border-t border-border">
      <Reveal className="mx-auto max-w-5xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{r.eyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-10">{r.title}</h2>

        <Link
          href="/verdelago"
          className="group flex flex-col sm:flex-row overflow-hidden rounded-lg border border-border bg-background shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.35)] max-w-xl"
        >
          <div className="relative aspect-[4/3] sm:w-64 shrink-0 overflow-hidden">
            <Image
              src="/images/verdelago/01-hero-humanizada.jpg"
              alt="Verdelago Resort"
              fill
              sizes="256px"
              className="object-cover object-[center_22%] transition-transform duration-700 group-hover:scale-[1.05]"
            />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <p className="text-xs tracking-[0.15em] uppercase text-foreground-muted">Altura, Algarve</p>
            <p className="font-display text-lg mt-1">Verdelago Resort</p>
            <p className="mt-1 text-sm text-accent">880 000 €</p>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}
