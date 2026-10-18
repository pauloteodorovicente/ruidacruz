"use client";

import { useState } from "react";
import { ColorThemePicker } from "./ColorThemePicker";

// Super-Destaque do card (Home e Portfólio): o card fica um pouco mais alto, na mesma
// largura, com selo "Em destaque" e a paleta escolhida aqui (as mesmas 7 do site).
// "Cor padrão do site" = terracota, como os demais cards.
export function CardHighlightField({
  defaultChecked,
  defaultColor,
}: {
  defaultChecked: boolean;
  defaultColor: string | null;
}) {
  const [on, setOn] = useState(defaultChecked);

  return (
    <div className="col-span-full flex flex-col gap-3 border border-border p-4">
      <label className="flex items-center gap-2">
        <input type="checkbox" name="card_highlight" checked={on} onChange={(e) => setOn(e.target.checked)} />
        <span className="text-sm">Super-Destaque do card (Home e Portfólio)</span>
      </label>
      <p className="text-xs text-foreground-muted">
        O card fica um pouco mais alto (mesma largura), com selo “Em destaque” e a cor escolhida abaixo.
      </p>
      {on && (
        <ColorThemePicker name="card_highlight_color" defaultValue={defaultColor} noneLabel="Cor padrão do site" />
      )}
    </div>
  );
}
