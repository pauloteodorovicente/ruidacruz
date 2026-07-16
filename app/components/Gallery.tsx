"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { galleryImages } from "@/lib/content";
import { Lightbox, lightboxItemCount } from "./Lightbox";
import { Reveal } from "./Reveal";

export function Gallery() {
  const { t, locale } = useLanguage();
  const g = t.gallery;
  const gridRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const grid = gridRef.current;
    const cursor = cursorRef.current;
    if (!grid || !cursor) return;
    const rect = grid.getBoundingClientRect();
    cursor.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px) translate(-50%, -50%)`;
  }

  function openAt(idx: number) {
    // +1 porque o vídeo ocupa a posição 0 na galeria completa do Lightbox
    setLightboxIndex(idx + 1);
    setLightboxOpen(true);
  }

  return (
    <section className="bg-background px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="block">
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{g.eyebrow}</p>
          <h2 className="font-display text-3xl md:text-4xl mb-10">{g.title}</h2>
        </Reveal>
        <div
          ref={gridRef}
          onMouseMove={handleMouseMove}
          className="relative grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3"
        >
          {galleryImages.map((img, idx) => (
            <button
              key={img.src}
              type="button"
              onClick={() => openAt(idx)}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              aria-label={locale === "pt" ? `Ver foto: ${img.alt.pt}` : `View photo: ${img.alt.en}`}
              className={`relative overflow-hidden text-left md:cursor-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${idx === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
            >
              <Image
                src={img.src}
                alt={img.alt[locale]}
                fill
                sizes={idx === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                quality={90}
                className="object-cover hover:scale-[1.03] transition-transform duration-500"
              />
            </button>
          ))}

          {/* Cursor customizado — elemento de assinatura, só em telas com mouse (md+) */}
          <div
            ref={cursorRef}
            className={`pointer-events-none absolute top-0 left-0 z-20 hidden h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-black/30 backdrop-blur-sm text-[11px] tracking-[0.1em] uppercase text-white transition-opacity duration-200 md:flex ${
              hovering ? "opacity-100" : "opacity-0"
            }`}
          >
            {locale === "pt" ? "Ver" : "View"}
          </div>
        </div>

        <button
          onClick={() => {
            setLightboxIndex(0);
            setLightboxOpen(true);
          }}
          className="mt-8 inline-flex items-center gap-2 border border-border px-6 py-3 text-sm tracking-[0.08em] uppercase text-foreground transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          {locale === "pt" ? "Ver Galeria Completa" : "View Full Gallery"}
          <span className="text-foreground-muted normal-case tracking-normal text-xs">
            ({lightboxItemCount - 1} {locale === "pt" ? "fotos + vídeo" : "photos + video"})
          </span>
        </button>

        <Lightbox
          open={lightboxOpen}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      </div>
    </section>
  );
}
