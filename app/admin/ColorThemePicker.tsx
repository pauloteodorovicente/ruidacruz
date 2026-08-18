"use client";

import { useState } from "react";
import { COLOR_THEMES } from "@/lib/property-colors";

// Cada opção mostra os dois tons (claro + escuro) lado a lado, porque o
// nome sozinho ("Bordô") não deixa claro como fica em cada tema — o Rui
// escolhe vendo a cor de verdade, não adivinhando pelo nome.
export function ColorThemePicker({ defaultValue }: { defaultValue?: string | null }) {
  const [selected, setSelected] = useState(defaultValue ?? "");

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name="color_theme" value={selected} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => setSelected("")}
          aria-pressed={selected === ""}
          className={`flex items-center gap-2 border px-3 py-2 text-left text-xs transition-colors ${
            selected === "" ? "border-accent text-accent" : "border-border text-foreground-muted hover:border-accent/50"
          }`}
        >
          <span className="h-4 w-4 shrink-0 rounded-full border border-border" />
          Nenhuma
        </button>
        {COLOR_THEMES.map((theme) => (
          <button
            key={theme.slug}
            type="button"
            onClick={() => setSelected(theme.slug)}
            aria-pressed={selected === theme.slug}
            className={`flex items-center gap-2 border px-3 py-2 text-left text-xs transition-colors ${
              selected === theme.slug ? "border-accent text-accent" : "border-border text-foreground-muted hover:border-accent/50"
            }`}
          >
            <span className="flex h-4 w-8 shrink-0 overflow-hidden rounded-full border border-border">
              <span className="h-full w-1/2" style={{ backgroundColor: theme.light }} />
              <span className="h-full w-1/2" style={{ backgroundColor: theme.dark }} />
            </span>
            {theme.label}
          </button>
        ))}
      </div>
    </div>
  );
}
