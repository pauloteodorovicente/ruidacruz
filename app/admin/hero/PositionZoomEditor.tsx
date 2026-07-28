"use client";

import { useRef, useState } from "react";
import type { HeroItem } from "@/lib/home-hero-types";

// Reposicionar arrastando direto na prévia (como a capa do Notion) + zoom
// por slider. position_x/position_y são o object-position em %; zoom é a
// escala aplicada por cima do object-fit: cover.
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
    const nextX = clamp(item.position_x - (dx / box.width) * 100 * (1 / item.zoom));
    const nextY = clamp(item.position_y - (dy / box.height) * 100 * (1 / item.zoom));
    onChange({ ...item, position_x: nextX, position_y: nextY });
  }

  function onPointerUp(e: React.PointerEvent) {
    setDragging(false);
    lastPoint.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={boxRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative aspect-video w-full overflow-hidden bg-black cursor-grab active:cursor-grabbing select-none"
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
      </div>
      <label className="flex items-center gap-3 text-xs text-foreground-muted">
        Zoom
        <input
          type="range"
          min={1}
          max={2.5}
          step={0.05}
          value={item.zoom}
          onChange={(e) => onChange({ ...item, zoom: Number(e.target.value) })}
          className="flex-1"
        />
      </label>
    </div>
  );
}

function clamp(v: number) {
  return Math.min(100, Math.max(0, v));
}
