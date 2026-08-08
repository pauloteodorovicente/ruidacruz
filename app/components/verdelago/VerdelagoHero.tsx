"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useVerdelagoLanguage } from "@/lib/verdelago-language-context";

const YOUTUBE_ID = "8VA_Y43QkKI";

export function VerdelagoHero() {
  const { t } = useVerdelagoLanguage();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  // Mesmo mecanismo de parallax do Hero da Leça (ver app/components/Hero.tsx)
  // — mas sem vídeo: o Verdelago só tem fotografia disponível.
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
            src="/images/verdelago/01-hero-humanizada.jpg"
            alt={t.hero.location}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-[center_22%]"
          />
        </div>

        {playing && (
          // O vídeo original tem uma faixa "RE/MAX Collection" fixa no canto
          // superior direito de cada frame — o iframe é sobredimensionado e
          // deslocado pra empurrar esse canto pra fora da área visível
          // (mesma técnica de object-fit: cover, feita à mão pra iframe).
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              id="verdelago-hero-video"
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
              title="Vídeo do Verdelago Resort"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute pointer-events-auto"
              style={{
                width: "220%",
                aspectRatio: "16 / 9",
                top: "-45%",
                left: "-45%",
              }}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-background to-transparent" />

        {!playing && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Reproduzir vídeo do Verdelago"
            className="group absolute bottom-8 right-6 md:bottom-12 md:right-12 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform hover:scale-110"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 translate-x-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}

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
