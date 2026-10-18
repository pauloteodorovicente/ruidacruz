"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";
import { useCustomCursor } from "@/lib/use-custom-cursor";
import { PropertyLightbox, type LightboxItem } from "./PropertyLightbox";
import type { PropertyPhoto } from "@/lib/properties";

// A grade tem GRID_SLOTS "espaços" (pedido do Paulo, 02/09: sempre limitada; o resto
// só aparece dentro do lightbox, que abre com "Ver Galeria Completa"). A mídia em
// destaque (admin → Fotos → "Destacar na galeria") ocupa 2x2 = FEATURED_SLOTS espaços
// sem aumentar a grade, então ela mostra menos mídias (pedido do Paulo, 18/10).
//
// O vídeo do Hero (quando existir — ver PropertyDynamicHero) só vira quadro da grade
// se o admin ligar "Mostrar o vídeo na galeria" ou se ele for a mídia em destaque; ele
// fica sempre como primeiro quadro. Fora da grade, continua acessível no lightbox,
// como o último item da navegação.
const GRID_SLOTS = 12;
const FEATURED_SLOTS = 4;

type Tile =
  | { kind: "image"; key: string; src: string; featured: boolean }
  | { kind: "video"; key: string; src: string; poster?: string; featured: boolean };

export function PropertyGallery({
  photos,
  alt,
  video,
  videoInGrid = false,
  featured = null,
}: {
  photos: PropertyPhoto[];
  alt: string;
  video?: { src: string; poster?: string };
  // O vídeo do Hero também é o primeiro quadro da grade.
  videoInGrid?: boolean;
  // Mídia em destaque (2x2): id de uma foto ou "video".
  featured?: string | null;
}) {
  const p = useTranslations("property");
  const lb = useTranslations("property.lightbox");
  const { areaRef, cursorRef, hovering, setHovering, handleMouseMove } = useCustomCursor<HTMLDivElement>();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (photos.length === 0 && !video) return null;

  const featuredVideo = Boolean(video && featured === "video");
  const featuredPhoto = featuredVideo ? undefined : photos.find((photo) => photo.id === featured);

  // Ordem única da grade e do lightbox: destaque, vídeo (se estiver na grade), fotos.
  const tiles: Tile[] = [];
  if (video && featuredVideo) tiles.push({ kind: "video", key: "video", src: video.src, poster: video.poster, featured: true });
  if (featuredPhoto) tiles.push({ kind: "image", key: featuredPhoto.id, src: featuredPhoto.storage_path, featured: true });
  if (video && !featuredVideo && videoInGrid) {
    tiles.push({ kind: "video", key: "video", src: video.src, poster: video.poster, featured: false });
  }
  for (const photo of photos) {
    if (photo.id === featuredPhoto?.id) continue;
    tiles.push({ kind: "image", key: photo.id, src: photo.storage_path, featured: false });
  }
  const videoInTiles = tiles.some((tile) => tile.kind === "video");
  // Vídeo fora da grade: só no fim do lightbox.
  if (video && !videoInTiles) tiles.push({ kind: "video", key: "video", src: video.src, poster: video.poster, featured: false });

  const hasFeatured = tiles.some((tile) => tile.featured);
  const plainSlots = GRID_SLOTS - (hasFeatured ? FEATURED_SLOTS : 0);
  const gridTiles = videoInGrid || featuredVideo || !video ? tiles : tiles.filter((tile) => tile.kind !== "video");
  const featuredTiles = gridTiles.filter((tile) => tile.featured);
  const plainTiles = gridTiles.filter((tile) => !tile.featured).slice(0, plainSlots);
  const shown = [...featuredTiles, ...plainTiles];
  const hasMore = shown.length < gridTiles.length;

  const items: LightboxItem[] = tiles.map((tile) =>
    tile.kind === "image"
      ? { kind: "image" as const, src: tile.src, alt }
      : { kind: "video" as const, src: tile.src, poster: tile.poster },
  );

  function openTile(tile: Tile) {
    setLightboxIndex(Math.max(0, tiles.indexOf(tile)));
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
          className="relative grid grid-flow-dense grid-cols-2 md:grid-cols-3 gap-2 md:gap-3"
        >
          {shown.map((tile) => (
            <div
              key={tile.key}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              data-gallery-cursor
              data-featured={tile.featured ? "true" : undefined}
              className={`relative aspect-square overflow-hidden md:cursor-none cursor-pointer ${
                tile.featured ? "col-span-2 row-span-2" : ""
              }`}
              onClick={() => openTile(tile)}
            >
              {tile.kind === "image" ? (
                <Image
                  src={tile.src}
                  alt={alt}
                  fill
                  sizes={tile.featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                  className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              ) : (
                <>
                  <video
                    src={tile.src}
                    poster={tile.poster}
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-black/40 backdrop-blur-sm">
                      <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-white" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </>
              )}
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

        {(hasMore || (video && !videoInGrid && !featuredVideo)) && (
          <button
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
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
