"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-[75vh] min-h-[520px] w-full overflow-hidden">
      <Image
        src="/images/leca-do-balio/01-hero-fachada.jpg"
        alt={t.hero.location}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
      <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 text-white">
        <p className="font-body text-xs tracking-[0.25em] uppercase opacity-80 mb-2">
          {t.hero.eyebrow}
        </p>
        <p className="font-display text-2xl md:text-3xl">{t.hero.location}</p>
      </div>
    </section>
  );
}
