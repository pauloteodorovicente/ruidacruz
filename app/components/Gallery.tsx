"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { galleryImages } from "@/lib/content";
import { Lightbox } from "./Lightbox";

export function Gallery() {
  const { t, locale } = useLanguage();
  const g = t.gallery;

  return (
    <section className="bg-background px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{g.eyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-10">{g.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {galleryImages.map((img, idx) => (
            <div
              key={img.src}
              className={`relative overflow-hidden ${idx === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
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
        </div>
        <Lightbox />
      </div>
    </section>
  );
}
