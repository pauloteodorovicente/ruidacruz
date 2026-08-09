"use client";

import { useEffect, useRef, useState } from "react";
import { FavoriteButton } from "@/app/components/FavoriteButton";
import type { HeroItem, HeroLayout, PropertyHero } from "@/lib/property-hero-types";

const GRID_AREAS: Record<Exclude<HeroLayout, "single">, string> = {
  duo: `"a b"`,
  trio: `"a a a b b" "a a a c c"`,
  quad: `"a b" "c d"`,
  penta: `"a a a b c" "a a a d e"`,
};
const GRID_COLS: Record<Exclude<HeroLayout, "single">, string> = {
  duo: "repeat(2, 1fr)",
  trio: "repeat(5, 1fr)",
  quad: "repeat(2, 1fr)",
  penta: "repeat(5, 1fr)",
};
const CELL_LETTERS = ["a", "b", "c", "d", "e"];

function itemStyle(item: HeroItem): React.CSSProperties {
  return { objectPosition: `${item.position_x}% ${item.position_y}%`, transform: `scale(${item.zoom})` };
}

// Mesma mecânica de pin + parallax + mosaico do DynamicHero da Home — forkado
// de propósito (ver proxy.ts: componentes de Hero nunca são compartilhados
// entre árvores) porque aqui o texto vem do próprio imóvel (título/zona), não
// de home.hero, e não tem a faixa de subtítulo + CTAs da Home embaixo — a
// página do imóvel já tem PropertyDetails logo em seguida.
export function PropertyDynamicHero({
  hero,
  eyebrow,
  title,
  propertyId,
}: {
  hero: PropertyHero;
  eyebrow: string;
  title: string;
  propertyId: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

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

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  const items = hero.items;
  const isVideo = hero.media_type === "video" && items[0];
  const isSingleImage = hero.media_type === "image" && hero.layout === "single" && items[0];
  const isMosaic = hero.media_type === "image" && hero.layout !== "single" && items.length > 1;

  return (
    <div ref={wrapperRef} data-hero-wrapper className="relative h-[160vh]">
      <section className="sticky top-0 h-[75vh] min-h-[520px] w-full overflow-hidden bg-black">
        {isVideo && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={itemStyle(items[0])}
            src={items[0].src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        )}

        {isSingleImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={items[0].src} alt="" className="absolute inset-0 h-full w-full object-cover" style={itemStyle(items[0])} />
        )}

        {isMosaic && (
          <div
            className="absolute inset-0 grid gap-1"
            style={{
              gridTemplateAreas: GRID_AREAS[hero.layout as Exclude<HeroLayout, "single">],
              gridTemplateColumns: GRID_COLS[hero.layout as Exclude<HeroLayout, "single">],
            }}
          >
            {items.map((item, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={item.src}
                alt=""
                className="h-full w-full object-cover overflow-hidden"
                style={{ gridArea: CELL_LETTERS[i], ...itemStyle(item) }}
              />
            ))}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-background to-transparent" />
        <FavoriteButton propertyId={propertyId} className="absolute top-6 right-6 z-10 md:top-8 md:right-8" />

        {isVideo && (
          <button
            onClick={toggleSound}
            aria-label={muted ? "Ativar som" : "Silenciar"}
            className="absolute bottom-8 right-6 md:bottom-12 md:right-12 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white hover:border-white transition-colors"
          >
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 9v6h4l5 5V4L8 9H4Z" strokeLinejoin="round" />
                <path d="M17 8.5a5 5 0 0 1 0 7" strokeLinecap="round" />
                <path d="M20 6a9 9 0 0 1 0 12" strokeLinecap="round" opacity="0.5" />
                <path d="M2 2l20 20" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 9v6h4l5 5V4L8 9H4Z" strokeLinejoin="round" />
                <path d="M17 8.5a5 5 0 0 1 0 7" strokeLinecap="round" />
                <path d="M20 6a9 9 0 0 1 0 12" strokeLinecap="round" />
              </svg>
            )}
          </button>
        )}

        <div ref={textRef} className="absolute bottom-8 left-6 md:bottom-12 md:left-12 text-white z-10 will-change-transform max-w-xl">
          <p className="font-body text-xs tracking-[0.25em] uppercase opacity-80 mb-2">{eyebrow}</p>
          <p className="font-display text-2xl md:text-4xl leading-tight">{title}</p>
        </div>
      </section>
    </div>
  );
}
