"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";
import { useCustomCursor } from "@/lib/use-custom-cursor";
import { PropertyLightbox, type LightboxItem } from "./PropertyLightbox";
import type { PropertyPhoto } from "@/lib/properties";

// Grade sempre limitada (pedido do Paulo, 02/09) — no máximo GRID_PHOTO_CAP
// fotos visíveis de cara, nunca a galeria inteira de uma vez (chegou a ter
// imóvel com 40+ fotos empilhadas). O resto só aparece dentro do lightbox,
// que abre com "Ver Galeria Completa". O vídeo do imóvel (se tiver Hero em
// vídeo — ver PropertyDynamicHero) entra como um card à parte, antes das
// fotos, e não conta pro limite de 12.
const GRID_PHOTO_CAP = 12;

export function PropertyGallery({
  photos,
  alt,
  video,
}: {
  photos: PropertyPhoto[];
  alt: string;
  video?: { src: string; poster?: string };
}) {
  const p = useTranslations("property");
  const lb = useTranslations("property.lightbox");
  const { areaRef, cursorRef, hovering, setHovering, handleMouseMove } = useCustomCursor<HTMLDivElement>();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (photos.length === 0 && !video) return null;

  const items: LightboxItem[] = [
    ...(video ? [{ kind: "video" as const, src: video.src, poster: video.poster }] : []),
    ...photos.map((photo) => ({ kind: "image" as const, src: photo.storage_path, alt })),
  ];
  const videoOffset = video ? 1 : 0;
  const visiblePhotos = photos.slice(0, GRID_PHOTO_CAP);
  const hasMore = photos.length > GRID_PHOTO_CAP;

  function openAt(index: number) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <section className="bg-background px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="block">
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-10">{p("gallery")}</p>
        </Reveal>
        <div
          ref={areaRef}
          onMouseMove={handleMouseMove}
          className="relative grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3"
        >
          {video && (
            <button
              type="button"
              onClick={() => openAt(0)}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              data-gallery-cursor
              aria-label={lb("video")}
              className="group relative aspect-square overflow-hidden md:cursor-none"
            >
              {video.poster ? (
                <Image
                  src={video.poster}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="absolute inset-0 bg-black" />
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/70 text-2xl text-white backdrop-blur-sm">
                  ▶
                </span>
              </span>
            </button>
          )}

          {visiblePhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              data-gallery-cursor
              className="relative aspect-square overflow-hidden md:cursor-none cursor-pointer"
              onClick={() => openAt(idx + videoOffset)}
            >
              <Image
                src={photo.storage_path}
                alt={alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
            </div>
          ))}
          <div
            ref={cursorRef}
            className={`pointer-events-none absolute top-0 left-0 z-20 hidden h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-black/30 backdrop-blur-sm text-[11px] tracking-[0.1em] uppercase text-white transition-opacity duration-200 md:flex ${
              hovering ? "opacity-100" : "opacity-0"
            }`}
          >
            {p("galleryViewCursor")}
          </div>
        </div>

        {(hasMore || video) && (
          <button
            onClick={() => openAt(0)}
            className="mt-8 mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border border-border px-6 py-3 text-sm tracking-[0.08em] uppercase text-foreground transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 text-center"
          >
            {lb("viewAll", { count: photos.length })}
          </button>
        )}

        <PropertyLightbox
          items={items}
          open={lightboxOpen}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      </div>
    </section>
  );
}
