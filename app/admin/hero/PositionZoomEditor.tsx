"use client";

import { useRef, useState } from "react";
import type { HeroItem } from "@/lib/home-hero-types";

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;

function clampPos(v: number) {
  return Math.min(100, Math.max(0, v));
}
function clampZoom(v: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v));
}

// Reposicionar arrastando direto na prévia (como a capa do Notion) + zoom
// pela roda do mouse ou pelos botões — position_x/position_y são o
// object-position em %; zoom é a escala aplicada por cima do object-fit: cover.
export function PositionZoomEditor({ item, onChange }: { item: HeroItem; onChange: (next: HeroItem) => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    lastPoint.current = { x: e.clientX, y: e.clientY };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || !lastPoint.current || !boxRef.current) return;
    const box = boxRef.current.getBoundingClientRect();
    const dx = e.clientX - lastPoint.current.x;
    const dy = e.clientY - lastPoint.current.y;
    lastPoint.current = { x: e.clientX, y: e.clientY };

    // Arrastar pra direita "empurra" o conteúdo pra direita — reduz o X do
    // object-position (revela mais do lado esquerdo da imagem original).
    const nextX = clampPos(item.position_x - (dx / box.width) * 100 * (1 / item.zoom));
    const nextY = clampPos(item.position_y - (dy / box.height) * 100 * (1 / item.zoom));
    onChange({ ...item, position_x: nextX, position_y: nextY });
  }

  function onPointerUp(e: React.PointerEvent) {
    setDragging(false);
    lastPoint.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.0015);
    onChange({ ...item, zoom: clampZoom(item.zoom * factor) });
  }

  function step(delta: number) {
    onChange({ ...item, zoom: clampZoom(item.zoom + delta) });
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={boxRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
        className="relative aspect-video w-full overflow-hidden bg-black cursor-grab active:cursor-grabbing select-none touch-none"
      >
        {item.kind === "video" ? (
          <video
            src={item.src}
            muted
            playsInline
            autoPlay
            loop
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            style={{ objectPosition: `${item.position_x}% ${item.position_y}%`, transform: `scale(${item.zoom})` }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            style={{ objectPosition: `${item.position_x}% ${item.position_y}%`, transform: `scale(${item.zoom})` }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 border border-white/20" />

        {/* Controle de zoom flutuante — mesmo padrão elegante do zoom das plantas */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1.5 shadow-lg"
        >
          <button
            type="button"
            onClick={() => step(-0.15)}
            disabled={item.zoom <= MIN_ZOOM + 0.001}
            aria-label="Diminuir zoom"
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M5 12h14" /></svg>
          </button>
          <span className="min-w-11 px-1 text-center text-[11px] tracking-[0.05em] text-white/70 tabular-nums">
            {Math.round(item.zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => step(0.15)}
            disabled={item.zoom >= MAX_ZOOM - 0.001}
            aria-label="Aumentar zoom"
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
