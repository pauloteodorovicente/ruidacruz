"use client";

import { useState, useTransition } from "react";
import { saveHomeCollectionSettings } from "../integrations-actions";
import type { HomeCollectionSettings } from "@/lib/settings";

const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1.5";

export function HomeCollectionForm({ initial }: { initial: HomeCollectionSettings }) {
  const [layout, setLayout] = useState<HomeCollectionSettings["layout"]>(initial.layout);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      saveHomeCollectionSettings({ layout });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-border p-6">
      <h2 className="font-display text-lg text-accent">Imóveis em Destaque (Home)</h2>
      <p className="text-sm text-foreground-muted">
        Como a seção de imóveis em destaque aparece na Home. Grade funciona bem com poucos imóveis; carrossel
        infinito é melhor com muitos — desliza sozinho, devagar, e aceita arrastar.
      </p>

      <label className="block">
        <span className={labelClass}>Layout</span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setLayout("grid")}
            className={`flex-1 border px-4 py-3 text-sm transition-colors ${
              layout === "grid" ? "border-accent text-accent" : "border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            Grade fixa
          </button>
          <button
            type="button"
            onClick={() => setLayout("carousel")}
            className={`flex-1 border px-4 py-3 text-sm transition-colors ${
              layout === "carousel" ? "border-accent text-accent" : "border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            Carrossel infinito
          </button>
        </div>
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
