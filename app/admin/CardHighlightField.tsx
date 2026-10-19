"use client";

import { useState } from "react";
import { ColorThemePicker } from "./ColorThemePicker";
import {
  CARD_HIGHLIGHT_LABELS,
  type CardHighlightOptions,
} from "@/lib/card-highlight";

const NAMES: Record<keyof CardHighlightOptions, string> = {
  badge: "hl_badge",
  taller: "hl_taller",
  border: "hl_border",
  pulse: "hl_pulse",
};

// Super-Destaque do card (Home e Portfólio): escolhe-se a cor e o que o card ganha — selo,
// ficar mais alto, borda, brilho que pulsa (pedido do Paulo, 18/10). Cada extra liga e
// desliga sozinho. "Cor padrão do site" = terracota, como os demais cards.
export function CardHighlightField({
  defaultChecked,
  defaultColor,
  defaultOptions,
}: {
  defaultChecked: boolean;
  defaultColor: string | null;
  defaultOptions: CardHighlightOptions;
}) {
  const [on, setOn] = useState(defaultChecked);

  return (
    <div className="col-span-full flex flex-col gap-3 border border-border p-4">
      <label className="flex items-center gap-2">
        <input type="checkbox" name="card_highlight" checked={on} onChange={(e) => setOn(e.target.checked)} />
        <span className="text-sm">Super-Destaque do card (Home e Portfólio)</span>
      </label>
      <p className="text-xs text-foreground-muted">
        Escolha a cor do card e o que ele ganha em relação aos outros.
      </p>
      {on && (
        <>
          <fieldset className="flex flex-col gap-1.5">
            <legend className="mb-1 text-[11px] uppercase tracking-[0.1em] text-foreground-muted">O que o card tem</legend>
            {(Object.keys(NAMES) as (keyof CardHighlightOptions)[]).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name={NAMES[key]} defaultChecked={defaultOptions[key]} />
                {CARD_HIGHLIGHT_LABELS[key]}
              </label>
            ))}
          </fieldset>
          <div>
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-foreground-muted">Cor do card</span>
            <ColorThemePicker name="card_highlight_color" defaultValue={defaultColor} noneLabel="Cor padrão do site" />
          </div>
        </>
      )}
    </div>
  );
}
