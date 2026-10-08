"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useVerdelagoLanguage } from "@/lib/verdelago-language-context";

// Hero da landing da Fase 6 (/verdelago6) — mesmo mecanismo de parallax do
// VerdelagoHero, com foto própria (diferente da página geral do Verdelago, a
// pedido do Paulo, 08/10) e o título do lançamento em vez da localização.
export function VerdelagoFase6Hero() {
  const { t } = useVerdelagoLanguage();
  const f = t.fase6;
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
            src="/images/verdelago/04-apartamento.jpg"
            alt={f.title}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-background to-transparent" />

        <div
          ref={textRef}
          className="absolute bottom-8 left-6 right-6 md:bottom-12 md:left-12 text-white z-10 will-change-transform"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase opacity-80 mb-2">{f.eyebrow}</p>
          <p className="font-display text-3xl md:text-5xl leading-tight max-w-3xl">{f.title}</p>
          <p className="font-display text-lg md:text-xl opacity-90 mt-2">{f.subtitle}</p>
        </div>
      </section>
    </div>
  );
}
