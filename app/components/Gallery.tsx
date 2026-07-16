"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { galleryImages } from "@/lib/content";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./Reveal";

export function Gallery() {
  const { t, locale } = useLanguage();
  const g = t.gallery;
  const gridRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const grid = gridRef.current;
    const cursor = cursorRef.current;
    if (!grid || !cursor) return;
    const rect = grid.getBoundingClientRect();
    cursor.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px) translate(-50%, -50%)`;
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
            <div
              key={img.src}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className={`relative overflow-hidden md:cursor-none ${idx === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
            >
              <Image
                src={img.src}
                alt={img.alt[locale]}
                fill
                sizes={idx === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                quality={90}
                className="object-cover hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
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
        <Lightbox />
      </div>
    </section>
  );
}
