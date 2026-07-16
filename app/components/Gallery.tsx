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
  const [overArrow, setOverArrow] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);

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

  function stepFeatured(e: React.MouseEvent, direction: 1 | -1) {
    e.stopPropagation();
    setFeaturedIndex((i) => (i + direction + galleryImages.length) % galleryImages.length);
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
          {galleryImages.map((img, idx) => {
            const isFeatured = idx === 0;
            const displayImg = isFeatured ? galleryImages[featuredIndex] : img;
            return (
              <div
                key={isFeatured ? `featured-${featuredIndex}` : img.src}
                role="button"
                tabIndex={0}
                onClick={() => openAt(isFeatured ? featuredIndex : idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openAt(isFeatured ? featuredIndex : idx);
                  }
                }}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                aria-label={locale === "pt" ? `Ver foto: ${displayImg.alt.pt}` : `View photo: ${displayImg.alt.en}`}
                className={`relative overflow-hidden text-left md:cursor-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${isFeatured ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
              >
                <Image
                  src={displayImg.src}
                  alt={displayImg.alt[locale]}
                  fill
                  sizes={isFeatured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                  quality={90}
                  className="object-cover hover:scale-[1.03] transition-transform duration-500"
                />

                {isFeatured && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => stepFeatured(e, -1)}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setOverArrow(true);
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        setOverArrow(false);
                      }}
                      aria-label={locale === "pt" ? "Foto anterior" : "Previous photo"}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/55 hover:text-white cursor-pointer"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={(e) => stepFeatured(e, 1)}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setOverArrow(true);
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        setOverArrow(false);
                      }}
                      aria-label={locale === "pt" ? "Próxima foto" : "Next photo"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/55 hover:text-white cursor-pointer"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            );
          })}

          {/* Cursor customizado — elemento de assinatura, só em telas com mouse (md+) */}
          <div
            ref={cursorRef}
            className={`pointer-events-none absolute top-0 left-0 z-20 hidden h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-black/30 backdrop-blur-sm text-[11px] tracking-[0.1em] uppercase text-white transition-opacity duration-200 md:flex ${
              hovering && !overArrow ? "opacity-100" : "opacity-0"
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
          className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border border-border px-6 py-3 text-sm tracking-[0.08em] uppercase text-foreground transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 text-center"
        >
          <span>{locale === "pt" ? "Ver Galeria Completa" : "View Full Gallery"}</span>
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
