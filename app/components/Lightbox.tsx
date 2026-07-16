"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { galleryImages } from "@/lib/content";
import { fullGalleryImages } from "@/lib/full-gallery";
import { useLanguage } from "@/lib/language-context";

const YT_VIDEO_ID = "1n12iQxzJj0";

type Item = { type: "video" } | { type: "image"; src: string; alt: string };

export function Lightbox() {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

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

  const current = items[index];

  return (
    <>
      <button
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        className="mt-8 text-sm tracking-[0.08em] uppercase text-accent border-b border-accent pb-0.5 hover:text-accent-strong transition-colors"
      >
        {locale === "pt"
          ? `Ver Galeria Completa (${items.length - 1} fotos + vídeo) →`
          : `View Full Gallery (${items.length - 1} photos + video) →`}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={close}
            aria-label="Fechar"
            className="absolute top-5 right-5 z-10 text-white/70 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
          <span className="absolute top-6 left-6 text-white/50 text-xs tracking-[0.1em]">
            {index + 1} / {items.length}
          </span>

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

          <div className="relative w-full h-full max-w-5xl max-h-[85vh] mx-auto flex items-center justify-center px-14">
            {current.type === "video" ? (
              <div className="w-full aspect-video">
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
      )}
    </>
  );
}
