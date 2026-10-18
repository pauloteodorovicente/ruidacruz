"use client";

import { useState } from "react";
import { COLOR_THEMES, type ColorTheme } from "@/lib/property-colors";

// Amostra da paleta: metade escura e metade clara, cada uma com o fundo da
// página e a cor de destaque — o Rui escolhe vendo como a página fica nos dois
// temas, não adivinhando pelo nome ("Bordô").
function ThemeSwatch({ theme }: { theme: ColorTheme }) {
  return (
    <span className="flex h-5 w-11 shrink-0 overflow-hidden rounded-full border border-border">
      {(["dark", "light"] as const).map((mode) => (
        <span key={mode} className="flex h-full w-1/2 items-center justify-center" style={{ backgroundColor: theme[mode].bg }}>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme[mode].accent }} />
        </span>
      ))}
    </span>
  );
}

// Grade de paletas, controlada de fora — serve a ficha do imóvel (ColorThemePicker,
// abaixo) e o formulário de cores por tipo em Integrações.
export function ColorThemeSwatches({
  value,
  onChange,
  noneLabel,
}: {
  value: string;
  onChange: (slug: string) => void;
  noneLabel: string;
}) {
  const optionClass = (selected: boolean) =>
    `flex items-center gap-2 border px-3 py-2 text-left text-xs transition-colors ${
      selected ? "border-accent text-accent" : "border-border text-foreground-muted hover:border-accent/50"
    }`;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button type="button" onClick={() => onChange("")} aria-pressed={value === ""} className={optionClass(value === "")}>
        <span className="h-5 w-11 shrink-0 rounded-full border border-dashed border-border" />
        {noneLabel}
      </button>
      {COLOR_THEMES.map((theme) => (
        <button
          key={theme.slug}
          type="button"
          onClick={() => onChange(theme.slug)}
          aria-pressed={value === theme.slug}
          className={optionClass(value === theme.slug)}
        >
          <ThemeSwatch theme={theme} />
          {theme.label}
        </button>
      ))}
    </div>
  );
}

export function ColorThemePicker({
  defaultValue,
  noneLabel = "Nenhuma",
  name = "color_theme",
}: {
  defaultValue?: string | null;
  noneLabel?: string;
  name?: string;
}) {
  const [selected, setSelected] = useState(defaultValue ?? "");

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={selected} />
      <ColorThemeSwatches value={selected} onChange={setSelected} noneLabel={noneLabel} />
    </div>
  );
}
