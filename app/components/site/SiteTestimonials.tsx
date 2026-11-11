"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/app/components/Reveal";
import type { Testimonial } from "@/lib/testimonials";

const AUTOPLAY_MS = 7000;

// Depoimentos em carrossel (pedido do Paulo, 11/11): os cartões deslizam
// sozinhos de 7 em 7 segundos, param quando o visitante passa o rato, toca ou
// usa as setas, e não animam sozinhos se o sistema pede menos movimento.
// Os dados continuam vindo do Supabase (admin > depoimentos).
export function SiteTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const s = useTranslations("testimonials");
  const items = testimonials.map((item) => ({ id: item.id, quote: item.quote, author: item.author_name }));
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  function step(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("figure");
    const gap = 24;
    const size = (card?.offsetWidth ?? track.clientWidth) + gap;
    const max = track.scrollWidth - track.clientWidth;
    let next = track.scrollLeft + direction * size;
    if (direction === 1 && track.scrollLeft >= max - 4) next = 0;
    if (direction === -1 && track.scrollLeft <= 4) next = max;
    track.scrollTo({ left: next, behavior: "smooth" });
  }

  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => step(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, items.length]);

  if (items.length === 0) return null;

  return (
    <section className="bg-background px-6 py-14 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-5xl block">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{s("eyebrow")}</p>
            <h2 className="font-display text-3xl md:text-4xl">{s("title")}</h2>
          </div>
          <p className="text-sm text-foreground-muted tracking-wide">★ {s("rating")}</p>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => (
              <figure
                key={item.id}
                className="flex w-full shrink-0 snap-start flex-col border-t border-border pt-6 md:w-[calc(50%-12px)]"
              >
                <blockquote className="font-body text-base leading-relaxed text-foreground-muted">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-auto pt-4 font-display text-sm text-foreground">{item.author}</figcaption>
              </figure>
            ))}
          </div>

          {items.length > 2 && (
            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Anterior"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Seguinte"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
