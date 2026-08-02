"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { galleryImages } from "@/lib/verdelago-content";
import { useVerdelagoLanguage } from "@/lib/verdelago-language-context";

type LightboxProps = {
  open: boolean;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export function VerdelagoLightbox({ open, index, onIndexChange, onClose }: LightboxProps) {
  const { locale, t } = useVerdelagoLanguage();
  const lb = t.lightbox;
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);

  const items = galleryImages;

  const next = useCallback(() => onIndexChange((index + 1) % items.length), [index, items.length, onIndexChange]);
  const prev = useCallback(
    () => onIndexChange((index - 1 + items.length) % items.length),
    [index, items.length, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, next, prev]);

  useEffect(() => {
    thumbRefs.current[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  function pageStrip(direction: 1 | -1) {
    const strip = stripRef.current;
    const first = thumbRefs.current[0];
    const second = thumbRefs.current[1];
    if (!strip || !first || !second) return;
    const itemPitch = second.offsetLeft - first.offsetLeft;
    const visibleCount = Math.max(1, Math.floor(strip.clientWidth / itemPitch));
    const pageAmount = Math.max(1, visibleCount - 2) * itemPitch;
    strip.scrollBy({ left: direction * pageAmount, behavior: "smooth" });
  }

  if (!open) return null;
  const current = items[index];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      <button
        onClick={onClose}
        aria-label={lb.close}
        className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center text-white/70 hover:text-white text-3xl leading-none"
      >
        ×
      </button>
      <span className="absolute top-6 left-6 z-10 text-white/50 text-xs tracking-[0.1em]">
        {index + 1} / {items.length}
      </span>

      <div className="relative flex-1 flex items-center justify-center px-14 min-h-0">
        <button
          onClick={prev}
          aria-label={lb.previous}
          className="absolute left-1 md:left-6 z-10 flex h-12 w-12 items-center justify-center text-white/60 hover:text-white text-4xl"
        >
          ‹
        </button>
        <button
          onClick={next}
          aria-label={lb.next}
          className="absolute right-1 md:right-6 z-10 flex h-12 w-12 items-center justify-center text-white/60 hover:text-white text-4xl"
        >
          ›
        </button>

        <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image src={current.src} alt={current.alt[locale]} fill sizes="100vw" quality={90} className="object-contain" />
          </div>
        </div>
      </div>

      <div className="relative shrink-0 border-t border-white/10 bg-black/60 px-12 py-3">
        <button
          onClick={() => pageStrip(-1)}
          aria-label="Ver miniaturas anteriores"
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-colors text-lg"
        >
          ‹
        </button>
        <button
          onClick={() => pageStrip(1)}
          aria-label="Ver mais miniaturas"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-colors text-lg"
        >
          ›
        </button>
        <div
          ref={stripRef}
          className="flex gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, i) => (
            <button
              key={i}
              ref={(el) => {
                thumbRefs.current[i] = el;
              }}
              onClick={() => onIndexChange(i)}
              className={`relative h-14 w-14 md:h-16 md:w-16 shrink-0 overflow-hidden transition-opacity ${
                i === index ? "ring-2 ring-accent opacity-100" : "opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={item.src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
