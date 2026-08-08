"use client";

import { useState } from "react";
import Image from "next/image";
import { useOneGreenwayLanguage } from "@/lib/onegreenway-language-context";
import { galleryPhotos } from "@/lib/onegreenway-content";
import { Reveal } from "../Reveal";

export function OneGreenwayGallery() {
  const { t } = useOneGreenwayLanguage();
  const g = t.gallery;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-background-raised px-6 py-14 md:px-12 md:py-20 border-y border-border">
      <Reveal className="mx-auto max-w-6xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{g.eyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-10">{g.title}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryPhotos.map((file, i) => (
            <button
              key={file}
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative aspect-[4/3] overflow-hidden bg-background"
            >
              <Image
                src={`/images/onegreenway/${encodeURIComponent(file)}`}
                alt={`${t.hero.location} — foto ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
            </button>
          ))}
        </div>
      </Reveal>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white text-sm tracking-[0.1em] uppercase"
            aria-label="Fechar"
          >
            Fechar ✕
          </button>
          {openIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i! > 0 ? i! - 1 : i));
              }}
              className="absolute left-4 md:left-8 text-white/70 hover:text-white text-3xl"
              aria-label="Foto anterior"
            >
              ‹
            </button>
          )}
          {openIndex < galleryPhotos.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i! < galleryPhotos.length - 1 ? i! + 1 : i));
              }}
              className="absolute right-4 md:right-8 text-white/70 hover:text-white text-3xl"
              aria-label="Próxima foto"
            >
              ›
            </button>
          )}
          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={`/images/onegreenway/${encodeURIComponent(galleryPhotos[openIndex])}`}
              alt={`${t.hero.location} — foto ${openIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
