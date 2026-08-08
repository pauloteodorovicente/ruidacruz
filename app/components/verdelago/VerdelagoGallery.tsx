"use client";

import { useState } from "react";
import Image from "next/image";
import { useVerdelagoLanguage } from "@/lib/verdelago-language-context";
import { galleryImages } from "@/lib/verdelago-content";
import { VerdelagoLightbox } from "./VerdelagoLightbox";
import { Reveal } from "../Reveal";
import { useCustomCursor } from "@/lib/use-custom-cursor";

const YOUTUBE_ID = "8VA_Y43QkKI";

export function VerdelagoGallery() {
  const { t, locale } = useVerdelagoLanguage();
  const g = t.gallery;
  const { areaRef: gridRef, cursorRef, hovering, setHovering, handleMouseMove } =
    useCustomCursor<HTMLDivElement>();
  const [overArrow, setOverArrow] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);

  function openAt(idx: number) {
    setLightboxIndex(idx);
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
            const hideOnMobile = idx >= galleryImages.length - 3;
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
                aria-label={`${g.viewPhoto}: ${displayImg.alt[locale]}`}
                className={`relative overflow-hidden text-left md:cursor-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${isFeatured ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"} ${hideOnMobile ? "hidden md:block" : ""}`}
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
                      aria-label={g.previousPhoto}
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
                      aria-label={g.nextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/55 hover:text-white cursor-pointer"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            );
          })}

          <div
            ref={cursorRef}
            className={`pointer-events-none absolute top-0 left-0 z-20 hidden h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-black/30 backdrop-blur-sm text-[11px] tracking-[0.1em] uppercase text-white transition-opacity duration-200 md:flex ${
              hovering && !overArrow ? "opacity-100" : "opacity-0"
            }`}
          >
            {g.viewCursor}
          </div>
        </div>

        <div className="relative mt-3 aspect-video overflow-hidden rounded-lg border border-border bg-black">
          {videoPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1`}
              title="Vídeo do Verdelago Resort"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setVideoPlaying(true)}
              className="group absolute inset-0 h-full w-full"
              aria-label="Reproduzir vídeo do Verdelago"
            >
              <Image
                src={`https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
                alt="Vídeo do Verdelago Resort"
                fill
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform group-hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 translate-x-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>

        <button
          onClick={() => {
            setLightboxIndex(0);
            setLightboxOpen(true);
          }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border border-border px-6 py-3 text-sm tracking-[0.08em] uppercase text-foreground transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 text-center"
        >
          <span>{g.viewFullGallery}</span>
          <span className="text-foreground-muted normal-case tracking-normal text-xs">
            ({galleryImages.length} {g.photos})
          </span>
        </button>

        <VerdelagoLightbox
          open={lightboxOpen}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      </div>
    </section>
  );
}
