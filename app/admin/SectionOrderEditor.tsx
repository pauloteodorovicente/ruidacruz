"use client";

import { useState, useTransition } from "react";
import { saveSectionOrder } from "./photo-actions";
import {
  SECTION_LABELS,
  resolveSectionOrder,
  defaultSectionOrder,
  type SectionId,
} from "@/lib/section-order";
import type { LayoutMode } from "@/lib/property-types";

// "Layout da página": arrastar as seções da ficha para a ordem que se quiser (pedido do
// Paulo, 18/10). As setinhas fazem o mesmo para quem prefere clicar. Guardar grava a
// ordem; "Voltar ao padrão do modelo" apaga a ordem própria. Seção sem conteúdo no
// imóvel (por exemplo, sem visita virtual) simplesmente não aparece no site.
export function SectionOrderEditor({
  propertyId,
  propertyReference,
  layoutMode,
  savedOrder,
}: {
  propertyId: string;
  propertyReference: string;
  layoutMode: LayoutMode;
  savedOrder: string[] | null;
}) {
  const visibleIds = (order: SectionId[]) => order.filter((id) => id !== "architect" || layoutMode === "arquitetura");
  const [order, setOrder] = useState<SectionId[]>(() => visibleIds(resolveSectionOrder(layoutMode, savedOrder)));
  const [baseline, setBaseline] = useState<string>(() => JSON.stringify(visibleIds(resolveSectionOrder(layoutMode, savedOrder))));
  const [customized, setCustomized] = useState(Boolean(savedOrder));
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const unchanged = JSON.stringify(order) === baseline;

  function move(from: number, to: number) {
    if (to < 0 || to >= order.length || from === to) return;
    setOrder((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setSaved(false);
  }

  function handleDragEnter(overIndex: number) {
    if (dragFrom === null || dragFrom === overIndex) return;
    move(dragFrom, overIndex);
    setDragFrom(overIndex);
  }

  function run(action: () => Promise<void>, onOk: () => void) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await action();
        onOk();
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao guardar o layout.");
      }
    });
  }

  function handleSave() {
    run(
      () => saveSectionOrder(propertyId, propertyReference, order),
      () => {
        setBaseline(JSON.stringify(order));
        setCustomized(true);
      },
    );
  }

  function handleReset() {
    const fallback = visibleIds(defaultSectionOrder(layoutMode));
    run(
      () => saveSectionOrder(propertyId, propertyReference, null),
      () => {
        setOrder(fallback);
        setBaseline(JSON.stringify(fallback));
        setCustomized(false);
      },
    );
  }

  return (
    <fieldset className="flex flex-col gap-4" data-testid="section-order">
      <h2 className="font-display text-lg text-accent">Layout da página</h2>
      <p className="text-xs text-foreground-muted -mt-2">
        Arraste as seções (ou use as setas) para a ordem em que aparecem na ficha, abaixo do topo. Seções sem conteúdo
        neste imóvel não aparecem.
      </p>
      <ol className="flex flex-col gap-2">
        {order.map((id, index) => (
          <li
            key={id}
            draggable
            onDragStart={() => setDragFrom(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => setDragFrom(null)}
            onDragEnd={() => setDragFrom(null)}
            data-section-id={id}
            className="flex cursor-grab items-center gap-3 border border-border bg-background-raised px-3 py-2.5 text-sm active:cursor-grabbing"
          >
            <span aria-hidden="true" className="text-foreground-muted">
              ⠿
            </span>
            <span className="flex-1">{SECTION_LABELS[id]}</span>
            <button
              type="button"
              disabled={index === 0 || isPending}
              onClick={() => move(index, index - 1)}
              title="Subir"
              aria-label={`Subir ${SECTION_LABELS[id]}`}
              className="flex h-7 w-7 items-center justify-center border border-border text-xs disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={index === order.length - 1 || isPending}
              onClick={() => move(index, index + 1)}
              title="Descer"
              aria-label={`Descer ${SECTION_LABELS[id]}`}
              className="flex h-7 w-7 items-center justify-center border border-border text-xs disabled:opacity-30"
            >
              ↓
            </button>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || unchanged}
          className="px-6 py-2.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong disabled:opacity-50"
        >
          {isPending ? "A guardar..." : "Guardar layout"}
        </button>
        {customized && (
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="text-xs underline underline-offset-2 text-foreground-muted hover:text-accent disabled:opacity-50"
          >
            Voltar ao padrão do modelo
          </button>
        )}
        {saved && <span className="text-sm text-accent">Guardado ✓</span>}
      </div>
      {error && (
        <p className="text-sm" style={{ color: "#a13f3f" }}>
          {error}
        </p>
      )}
    </fieldset>
  );
}
