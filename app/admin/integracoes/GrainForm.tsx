"use client";

import { useEffect, useState, useTransition } from "react";
import { saveGrainSettings } from "../integrations-actions";
import type { GrainSettings } from "@/lib/settings";

const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1.5";
// Opacidade CSS real do grão vai de 0 até esse teto — 0.2 já é bem perceptível
// (grão forte); acima disso começa a ficar ruidoso demais pro "quiet luxury"
// do site. O slider mostra 0-100% desse intervalo, não o número cru do CSS.
const MAX_OPACITY = 0.2;

export function GrainForm({ initial }: { initial: GrainSettings }) {
  const [opacity, setOpacity] = useState(initial.opacity);
  const [isPending, startTransition] = useTransition();
  const percent = Math.round((opacity / MAX_OPACITY) * 100);

  // Prévia ao vivo — enquanto arrasta, aplica na hora na própria página
  // (o grão é um body::before global, então a página do admin também o
  // mostra) via a mesma custom property lida em app/layout.tsx. Só entra em
  // vigor pra outros visitantes/páginas depois de "Guardar" de verdade.
  useEffect(() => {
    document.documentElement.style.setProperty("--grain-opacity", String(opacity));
    return () => {
      document.documentElement.style.removeProperty("--grain-opacity");
    };
  }, [opacity]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      saveGrainSettings({ opacity });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-border p-6">
      <h2 className="font-display text-lg text-accent">Textura de Grão</h2>
      <p className="text-sm text-foreground-muted">
        Intensidade do grão sutil aplicado em todo o site, nos dois temas. Arraste pra ver o efeito mudando ao
        vivo nesta própria página antes de guardar.
      </p>

      <label className="block">
        <span className={labelClass}>
          Intensidade — {percent}%
        </span>
        <input
          type="range"
          min={0}
          max={MAX_OPACITY}
          step={0.005}
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full accent-accent"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="self-start px-6 py-2.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong disabled:opacity-50"
      >
        {isPending ? "A guardar..." : "Guardar"}
      </button>
    </form>
  );
}
