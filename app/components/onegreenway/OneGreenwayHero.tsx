"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useOneGreenwayLanguage } from "@/lib/onegreenway-language-context";

export function OneGreenwayHero() {
  const { t } = useOneGreenwayLanguage();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;

    function update() {
      ticking = false;
      const wrapper = wrapperRef.current;
      const text = textRef.current;
      if (!wrapper || !text) return;

      const rect = wrapper.getBoundingClientRect();
      const pinRange = wrapper.offsetHeight - window.innerHeight;
      const progress = pinRange > 0 ? Math.min(1, Math.max(0, -rect.top / pinRange)) : 0;

      text.style.transform = `translateY(${progress * -120}px)`;
      text.style.opacity = `${1 - progress * 0.8}`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={wrapperRef} data-hero-wrapper className="relative h-[160vh]">
      <section className="sticky top-0 h-[75vh] min-h-[520px] w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <Image
            src="/images/onegreenway/hero-1.jpg"
            alt={t.hero.location}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-background to-transparent" />

        <div
          ref={textRef}
          className="absolute bottom-8 left-6 md:bottom-12 md:left-12 text-white z-10 will-change-transform"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase opacity-80 mb-2">
            {t.hero.eyebrow}
          </p>
          <p className="font-display text-2xl md:text-3xl">{t.hero.location}</p>
        </div>
      </section>
    </div>
  );
}
