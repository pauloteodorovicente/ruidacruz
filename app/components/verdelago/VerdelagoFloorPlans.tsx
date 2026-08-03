"use client";

import { useState } from "react";
import { useVerdelagoLanguage } from "@/lib/verdelago-language-context";
import { floorplans } from "@/lib/verdelago-content";
import { Reveal } from "../Reveal";
import { ZoomableImage } from "../ZoomableImage";

export function VerdelagoFloorPlans() {
  const { t } = useVerdelagoLanguage();
  const p = t.floorplans;
  const [active, setActive] = useState<(typeof floorplans)[number]["id"]>(floorplans[0].id);
  const [open, setOpen] = useState(false);
  const current = floorplans.find((f) => f.id === active)!;

  return (
    <section className="bg-background-raised px-6 py-10 md:px-12 md:py-14 border-y border-border">
      <Reveal className="mx-auto max-w-4xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-1">{p.eyebrow}</p>
          <p className="font-display text-xl md:text-2xl">{p.title}</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm tracking-[0.08em] uppercase text-foreground transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          {p.cta} →
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
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center text-white/70 hover:text-white text-3xl leading-none"
          >
            ×
          </button>

          <div className="flex gap-2 mb-4 z-10 flex-wrap justify-center" onClick={(e) => e.stopPropagation()}>
            {floorplans.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={`px-4 py-2 text-xs tracking-[0.08em] uppercase border transition-colors ${
                  active === f.id ? "border-accent text-accent" : "border-white/30 text-white/60 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full flex-1 bg-[#f4f2ee] min-h-0" onClick={(e) => e.stopPropagation()}>
            <ZoomableImage key={current.id} src={current.src} alt={`${p.title} — ${current.label}`} />
          </div>
          <p className="mt-3 text-[11px] text-white/40 z-10">{p.credit}</p>
        </div>
      )}
    </section>
  );
}
