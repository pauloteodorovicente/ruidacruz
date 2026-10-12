"use client";

import { useState, useTransition } from "react";
import { saveCardCarouselSettings } from "../integrations-actions";
import { CARD_CAROUSEL_LIMITS } from "@/lib/cover";
import type { CardCarouselSettings } from "@/lib/cover";

const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1.5";
const L = CARD_CAROUSEL_LIMITS;

// Padrão do carrossel automático das capas dos cards (Home e Portfólio). Cada
// imóvel pode sobrescrever na própria ficha (campo "Capa nos cards"). Pedido
// do Paulo (09/10/2026): ligar/desligar, intervalo, quantas fotos, exceção
// por imóvel.
export function CardCarouselForm({ initial }: { initial: CardCarouselSettings }) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [intervalSeconds, setIntervalSeconds] = useState(initial.intervalSeconds);
  const [maxPhotos, setMaxPhotos] = useState(initial.maxPhotos);
  const [baseline, setBaseline] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const unchanged =
    enabled === baseline.enabled && intervalSeconds === baseline.intervalSeconds && maxPhotos === baseline.maxPhotos;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        const result = await saveCardCarouselSettings({ enabled, intervalSeconds, maxPhotos });
        setBaseline(result.settings);
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao guardar.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 border border-border p-6">
      <h2 className="font-display text-lg text-accent">Capas dos cards</h2>
      <p className="text-sm text-foreground-muted">
        Na Home e no Portfólio, a capa de cada imóvel pode passar sozinha pelas fotos dele, começando pela capa
        escolhida em Fotos. Só gira quem tem mais de uma foto visível. Cada imóvel pode ter uma exceção na própria
        ficha (campo “Capa nos cards”). Quem não tem nenhuma foto mostra a assinatura do Rui.
      </p>

      <div>
        <span className={labelClass}>Carrossel automático (padrão do site)</span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setEnabled(true);
              setSaved(false);
            }}
            className={`flex-1 border px-4 py-3 text-sm transition-colors ${
              enabled ? "border-accent text-accent" : "border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            Ligado
          </button>
          <button
            type="button"
            onClick={() => {
              setEnabled(false);
              setSaved(false);
            }}
            className={`flex-1 border px-4 py-3 text-sm transition-colors ${
              !enabled ? "border-accent text-accent" : "border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            Desligado (só a capa)
          </button>
        </div>
      </div>

      <label className={`block ${enabled ? "" : "opacity-50"}`}>
        <span className={labelClass}>Tempo de cada foto — {intervalSeconds.toString().replace(".", ",")} s</span>
        <input
          type="range"
          min={L.intervalSeconds.min}
          max={L.intervalSeconds.max}
          step={0.5}
          value={intervalSeconds}
          disabled={!enabled}
          onChange={(e) => {
            setIntervalSeconds(Number(e.target.value));
            setSaved(false);
          }}
          className="w-full accent-accent"
        />
      </label>

      <label className={`block ${enabled ? "" : "opacity-50"}`}>
        <span className={labelClass}>Quantas fotos entram no giro — {maxPhotos}</span>
        <input
          type="range"
          min={L.maxPhotos.min}
          max={L.maxPhotos.max}
          step={1}
          value={maxPhotos}
          disabled={!enabled}
          onChange={(e) => {
            setMaxPhotos(Number(e.target.value));
            setSaved(false);
          }}
          className="w-full accent-accent"
        />
        <p className="text-xs text-foreground-muted mt-1.5">
          A capa mais as seguintes, na ordem da galeria. Menos fotos = card mais leve.
        </p>
      </label>

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
