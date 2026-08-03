"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const DOUBLE_TAP_SCALE = 2.5;

type Vec = { x: number; y: number };
type ZoomState = { scale: number; tx: number; ty: number };

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

// Zoom + pan "padrão ouro": wheel (zoom no ponto do cursor), drag pra
// panorâmica (só quando há zoom aplicado), pinch de dois dedos em touch,
// duplo clique/duplo toque alterna 1x/2.5x, botões +/-/reset e indicador de
// nível. Usado no modal de plantas (Leça e Verdelago).
export function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ZoomState>({ scale: 1, tx: 0, ty: 0 });
  const stateRef = useRef(state);
  stateRef.current = state;

  const pointers = useRef(new Map<number, Vec>());
  const dragOrigin = useRef<{ pointer: Vec; state: ZoomState } | null>(null);
  const pinchOrigin = useRef<{ dist: number; scale: number } | null>(null);
  const lastTap = useRef(0);

  function maxPan(scale: number) {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return {
      x: Math.max(0, (rect.width * (scale - 1)) / 2),
      y: Math.max(0, (rect.height * (scale - 1)) / 2),
    };
  }

  function clampState(next: ZoomState): ZoomState {
    const scale = clamp(next.scale, MIN_SCALE, MAX_SCALE);
    const pan = maxPan(scale);
    return { scale, tx: clamp(next.tx, -pan.x, pan.x), ty: clamp(next.ty, -pan.y, pan.y) };
  }

  const zoomAt = useCallback((clientX: number, clientY: number, factor: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = clientX - rect.left - rect.width / 2;
    const cy = clientY - rect.top - rect.height / 2;
    setState((prev) => {
      const nextScale = clamp(prev.scale * factor, MIN_SCALE, MAX_SCALE);
      const ratio = nextScale / prev.scale;
      return clampState({
        scale: nextScale,
        tx: cx - (cx - prev.tx) * ratio,
        ty: cy - (cy - prev.ty) * ratio,
      });
    });
  }, []);

  function resetZoom() {
    setState({ scale: 1, tx: 0, ty: 0 });
  }

  function toggleDoubleZoom(clientX: number, clientY: number) {
    if (stateRef.current.scale > 1.05) {
      resetZoom();
    } else {
      zoomAt(clientX, clientY, DOUBLE_TAP_SCALE);
    }
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.0018);
    zoomAt(e.clientX, e.clientY, factor);
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1) {
      dragOrigin.current = { pointer: { x: e.clientX, y: e.clientY }, state: stateRef.current };
      const now = Date.now();
      if (now - lastTap.current < 300) {
        toggleDoubleZoom(e.clientX, e.clientY);
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    } else if (pointers.current.size === 2) {
      dragOrigin.current = null;
      const pts = Array.from(pointers.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchOrigin.current = { dist, scale: stateRef.current.scale };
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchOrigin.current) {
      const pts = Array.from(pointers.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const factor = dist / pinchOrigin.current.dist;
      const targetScale = clamp(pinchOrigin.current.scale * factor, MIN_SCALE, MAX_SCALE);
      zoomAt(midX, midY, targetScale / stateRef.current.scale);
      return;
    }

    if (pointers.current.size === 1 && dragOrigin.current && stateRef.current.scale > 1.001) {
      const dx = e.clientX - dragOrigin.current.pointer.x;
      const dy = e.clientY - dragOrigin.current.pointer.y;
      setState(
        clampState({
          scale: dragOrigin.current.state.scale,
          tx: dragOrigin.current.state.tx + dx,
          ty: dragOrigin.current.state.ty + dy,
        })
      );
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchOrigin.current = null;
    if (pointers.current.size === 0) dragOrigin.current = null;
  }

  // Recentraliza se a janela redimensionar (ex.: rotação de tela)
  useEffect(() => {
    function onResize() {
      setState((prev) => clampState(prev));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isZoomed = state.scale > 1.001;

  return (
    <div className="relative w-full h-full flex flex-col min-h-0">
      <div
        ref={containerRef}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`relative flex-1 min-h-0 overflow-hidden touch-none select-none ${isZoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${state.tx}px, ${state.ty}px) scale(${state.scale})`,
            transition: dragOrigin.current || pinchOrigin.current ? "none" : "transform 0.2s ease-out",
            willChange: "transform",
          }}
        >
          {/* img simples (não next/image): já otimizada, e o transform de
              zoom/pan não precisa da lógica de sizes/fill do next/image */}
          <img src={src} alt={alt} draggable={false} className="max-w-full max-h-full w-auto h-auto object-contain" />
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1.5 shadow-lg">
        <button
          onClick={() => zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1 / 1.5)}
          disabled={state.scale <= MIN_SCALE + 0.001}
          aria-label="Diminuir zoom"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M5 12h14" /></svg>
        </button>
        <button
          onClick={resetZoom}
          className="min-w-12 px-2 text-center text-[11px] tracking-[0.05em] text-white/70 hover:text-white transition-colors tabular-nums"
        >
          {Math.round(state.scale * 100)}%
        </button>
        <button
          onClick={() => zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1.5)}
          disabled={state.scale >= MAX_SCALE - 0.001}
          aria-label="Aumentar zoom"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
        </button>
      </div>
    </div>
  );
}
