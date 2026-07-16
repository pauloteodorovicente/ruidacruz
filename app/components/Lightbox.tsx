"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { galleryImages } from "@/lib/content";
import { fullGalleryImages } from "@/lib/full-gallery";
import { useLanguage } from "@/lib/language-context";

const YT_VIDEO_ID = "1n12iQxzJj0";
const YT_THUMB = `https://i.ytimg.com/vi/${YT_VIDEO_ID}/hqdefault.jpg`;

type Item = { type: "video" } | { type: "image"; src: string; alt: string };

export function Lightbox() {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const items: Item[] = [
    { type: "video" },
    ...galleryImages.map((img) => ({ type: "image" as const, src: img.src, alt: img.alt[locale] })),
    ...fullGalleryImages.map((src) => ({ type: "image" as const, src, alt: "Moradia Leça do Balio" })),
  ];

  const close = useCallback(() => setOpen(false), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, next, prev]);

  useEffect(() => {
    thumbRefs.current[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  const current = items[index];

  return (
    <>
      <button
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        className="mt-8 inline-flex items-center gap-2 border border-border px-6 py-3 text-sm tracking-[0.08em] uppercase text-foreground hover:border-accent hover:text-accent transition-colors"
      >
        {locale === "pt" ? "Ver Galeria Completa" : "View Full Gallery"}
        <span className="text-foreground-muted normal-case tracking-normal text-xs">
          ({items.length - 1} {locale === "pt" ? "fotos + vídeo" : "photos + video"})
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <button
            onClick={close}
            aria-label="Fechar"
            className="absolute top-5 right-5 z-10 text-white/70 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
          <span className="absolute top-6 left-6 z-10 text-white/50 text-xs tracking-[0.1em]">
            {index + 1} / {items.length}
          </span>

          <div className="relative flex-1 flex items-center justify-center px-14 min-h-0">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-2 md:left-6 z-10 text-white/60 hover:text-white text-4xl px-2"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Próxima"
              className="absolute right-2 md:right-6 z-10 text-white/60 hover:text-white text-4xl px-2"
            >
              ›
            </button>

            <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center">
              {current.type === "video" ? (
                <div className="w-full aspect-video max-h-full">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${YT_VIDEO_ID}?rel=0&modestbranding=1`}
                    title="Moradia Leça do Balio — Vídeo"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    sizes="100vw"
                    quality={90}
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-black/60 px-4 py-3 overflow-x-auto">
            <div className="flex gap-2 w-max mx-auto">
              {items.map((item, i) => (
                <button
                  key={i}
                  ref={(el) => {
                    thumbRefs.current[i] = el;
                  }}
                  onClick={() => setIndex(i)}
                  className={`relative h-14 w-14 md:h-16 md:w-16 shrink-0 overflow-hidden transition-opacity ${
                    i === index ? "ring-2 ring-accent opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  {item.type === "video" ? (
                    <>
                      <Image src={YT_THUMB} alt="Vídeo" fill sizes="64px" className="object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-lg">▶</span>
                    </>
                  ) : (
                    <Image src={item.src} alt="" fill sizes="64px" className="object-cover" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
