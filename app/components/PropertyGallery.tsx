"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";
import { useCustomCursor } from "@/lib/use-custom-cursor";
import type { PropertyPhoto } from "@/lib/properties";

// Versão simplificada da galeria genérica — grid com o mesmo cursor
// customizado da Leça do Balio, mas sem lightbox/vídeo ainda (isso fica
// pra um próximo output, junto com a generalização dos 3 modos de layout).
export function PropertyGallery({ photos, alt }: { photos: PropertyPhoto[]; alt: string }) {
  const p = useTranslations("property");
  const { areaRef, cursorRef, hovering, setHovering, handleMouseMove } = useCustomCursor<HTMLDivElement>();

  if (photos.length === 0) return null;

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
          {photos.map((photo) => (
            <div
              key={photo.id}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className="relative aspect-square overflow-hidden md:cursor-none"
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
      </div>
    </section>
  );
}
