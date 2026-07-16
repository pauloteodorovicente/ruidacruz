"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { Reveal } from "./Reveal";

const floors = [
  { id: "rc", src: "/images/leca-do-balio/planta/res-do-chao.jpg", label: { pt: "Rés-do-Chão", en: "Ground Floor" } },
  { id: "piso1", src: "/images/leca-do-balio/planta/piso1-andar.jpg", label: { pt: "1º Andar", en: "1st Floor" } },
] as const;

export function FloorPlan() {
  const { locale } = useLanguage();
  const [active, setActive] = useState<(typeof floors)[number]["id"]>("rc");
  const [zoomed, setZoomed] = useState(false);
  const current = floors.find((f) => f.id === active)!;

  const copy = {
    eyebrow: locale === "pt" ? "Planta" : "Floor Plan",
    title: locale === "pt" ? "Planta Baixa" : "Floor Plan",
    credit: "Manuel Ventura Arquitecto",
    zoomHint: locale === "pt" ? "Clique para ampliar" : "Click to zoom",
  };

  return (
    <section className="bg-background-raised px-6 py-14 md:px-12 md:py-20 border-y border-border">
      <Reveal className="mx-auto max-w-4xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{copy.eyebrow}</p>
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-8">
          <h2 className="font-display text-3xl md:text-4xl">{copy.title}</h2>
          <p className="text-xs text-foreground-muted">{copy.credit}</p>
        </div>

        <div className="flex gap-2 mb-6">
          {floors.map((f) => (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              className={`px-4 py-2 text-xs tracking-[0.08em] uppercase border transition-colors ${
                active === f.id
                  ? "border-accent text-accent"
                  : "border-border text-foreground-muted hover:text-foreground"
              }`}
            >
              {f.label[locale]}
            </button>
          ))}
        </div>

        <button
          onClick={() => setZoomed(true)}
          className="group relative block w-full bg-[#f4f2ee] border border-border overflow-hidden focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          <Image
            src={current.src}
            alt={`${copy.title} — ${current.label[locale]}`}
            width={1820}
            height={2574}
            sizes="(max-width: 768px) 100vw, 800px"
            className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute bottom-3 right-3 text-[10px] tracking-[0.08em] uppercase bg-black/70 text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {copy.zoomHint}
          </span>
        </button>
      </Reveal>

      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 md:p-12"
          onClick={() => setZoomed(false)}
        >
          <button
            onClick={() => setZoomed(false)}
            aria-label="Fechar"
            className="absolute top-5 right-5 z-10 text-white/70 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
          <div className="relative w-full h-full bg-[#f4f2ee]">
            <Image
              src={current.src}
              alt={`${copy.title} — ${current.label[locale]}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
