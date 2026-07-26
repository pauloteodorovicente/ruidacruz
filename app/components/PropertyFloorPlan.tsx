"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";
import { trackEvent } from "@/lib/track-event";
import type { PropertyFloorplan } from "@/lib/property-types";

// Versão genérica do FloorPlan.tsx da Leça do Balio — nº de pisos vem do
// banco (property_floorplans), não fixo em 2. Sem plantas cadastradas, a
// seção simplesmente não aparece (é opcional por imóvel).
export function PropertyFloorPlan({
  floorplans,
  propertyReference,
}: {
  floorplans: PropertyFloorplan[];
  propertyReference: string;
}) {
  const t = useTranslations("property.floorPlan");
  const [activeId, setActiveId] = useState(floorplans[0]?.id);
  const [open, setOpen] = useState(false);
  const current = floorplans.find((f) => f.id === activeId);

  if (floorplans.length === 0 || !current) return null;

  const copy = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    cta: t("cta", { count: floorplans.length }),
  };

  return (
    <section className="bg-background-raised px-6 py-10 md:px-12 md:py-14 border-y border-border">
      <Reveal className="mx-auto max-w-4xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-1">{copy.eyebrow}</p>
          <p className="font-display text-xl md:text-2xl">{copy.title}</p>
        </div>
        <button
          onClick={() => {
            trackEvent("floorplan_view", propertyReference);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm tracking-[0.08em] uppercase text-foreground transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          {copy.cta} →
        </button>
      </Reveal>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 md:p-12" onClick={() => setOpen(false)}>
          <button
            onClick={() => setOpen(false)}
            aria-label={t("close")}
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center text-white/70 hover:text-white text-3xl leading-none"
          >
            ×
          </button>

          {floorplans.length > 1 && (
            <div className="flex gap-2 mb-4 z-10" onClick={(e) => e.stopPropagation()}>
              {floorplans.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveId(f.id)}
                  className={`px-4 py-2 text-xs tracking-[0.08em] uppercase border transition-colors ${
                    activeId === f.id ? "border-accent text-accent" : "border-white/30 text-white/60 hover:text-white"
                  }`}
                >
                  {f.floor_label}
                </button>
              ))}
            </div>
          )}

          <div className="relative w-full flex-1 bg-[#f4f2ee] min-h-0" onClick={(e) => e.stopPropagation()}>
            <Image src={current.storage_path} alt={`${copy.title} — ${current.floor_label}`} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </section>
  );
}
