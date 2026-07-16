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
  const [open, setOpen] = useState(false);
  const current = floors.find((f) => f.id === active)!;

  const copy = {
    eyebrow: locale === "pt" ? "Planta" : "Floor Plan",
    title: locale === "pt" ? "Planta Baixa" : "Floor Plan",
    cta: locale === "pt" ? "Ver Planta Baixa" : "View Floor Plan",
    credit: "Manuel Ventura Arquitecto",
  };

  return (
    <section className="bg-background-raised px-6 py-10 md:px-12 md:py-14 border-y border-border">
      <Reveal className="mx-auto max-w-4xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-1">{copy.eyebrow}</p>
          <p className="font-display text-xl md:text-2xl">{copy.title}</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm tracking-[0.08em] uppercase text-foreground transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          {copy.cta} →
        </button>
      </Reveal>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 md:p-12"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar"
            className="absolute top-5 right-5 z-10 text-white/70 hover:text-white text-3xl leading-none"
          >
            ×
          </button>

          <div
            className="flex gap-2 mb-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {floors.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={`px-4 py-2 text-xs tracking-[0.08em] uppercase border transition-colors ${
                  active === f.id
                    ? "border-accent text-accent"
                    : "border-white/30 text-white/60 hover:text-white"
                }`}
              >
                {f.label[locale]}
              </button>
            ))}
          </div>

          <div
            className="relative w-full flex-1 bg-[#f4f2ee] min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={`${copy.title} — ${current.label[locale]}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <p className="mt-3 text-[11px] text-white/40 z-10">{copy.credit}</p>
        </div>
      )}
    </section>
  );
}
