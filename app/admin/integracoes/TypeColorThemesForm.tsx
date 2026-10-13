"use client";

import { useState, useTransition } from "react";
import { saveTypeColorThemes } from "../integrations-actions";
import { ColorThemeSwatches } from "../ColorThemePicker";
import { COLOR_THEME_PROPERTY_TYPES, type TypeColorThemes } from "@/lib/property-colors";

const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1.5";

// Cor da página inteira por TIPO de imóvel. Vale pra toda ficha desse tipo que
// não tenha cor própria (a escolha feita na ficha do imóvel sempre manda).
// Landings de campanha não entram aqui — só mudam de cor se a própria ficha
// delas tiver uma paleta escolhida.
export function TypeColorThemesForm({ initial }: { initial: TypeColorThemes }) {
  const [themes, setThemes] = useState<Record<string, string>>({ ...initial });
  const [baseline, setBaseline] = useState<Record<string, string>>({ ...initial });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const unchanged = COLOR_THEME_PROPERTY_TYPES.every(({ value }) => (themes[value] ?? "") === (baseline[value] ?? ""));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        const result = await saveTypeColorThemes(themes as TypeColorThemes);
        setBaseline({ ...result.themes });
        setThemes({ ...result.themes });
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao guardar.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 border border-border p-6">
      <h2 className="font-display text-lg text-accent">Cores por tipo de imóvel</h2>
      <p className="text-sm text-foreground-muted">
        Escolha a cor da página inteira (fundo, cartões, texto e destaque) para cada tipo de imóvel. Vale para toda
        ficha desse tipo que não tenha cor própria — a escolha feita na ficha do imóvel sempre manda. A Home e o
        resto do site não mudam, e as landings de campanha só mudam se a própria ficha delas tiver uma cor.
      </p>

      {COLOR_THEME_PROPERTY_TYPES.map(({ value, label }) => (
        <div key={value}>
          <span className={labelClass}>{label}</span>
          <ColorThemeSwatches
            value={themes[value] ?? ""}
            onChange={(slug) => {
              setThemes((prev) => {
                const next = { ...prev };
                if (slug) next[value] = slug;
                else delete next[value];
                return next;
              });
              setSaved(false);
            }}
            noneLabel="Padrão do site"
          />
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending || unchanged}
          className="px-6 py-2.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong disabled:opacity-50"
        >
          {isPending ? "A guardar..." : "Guardar"}
        </button>
        {saved && <span className="text-sm text-accent">Guardado ✓ (aparece no site em até 1 minuto)</span>}
      </div>
      {error && (
        <p className="text-sm" style={{ color: "#a13f3f" }}>
          {error}
        </p>
      )}
    </form>
  );
}
