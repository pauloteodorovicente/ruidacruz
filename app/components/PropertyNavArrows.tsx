"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const DRAG_THRESHOLD = 60;
const CLICK_SUPPRESS_THRESHOLD = 8;

function ArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {direction === "prev" ? (
        <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

// Setas fixas nas bordas da tela — cada uma é um <a> de verdade (funciona
// no clique/teclado sem depender de JS) e, por cima disso, um gesto de
// arrastar horizontal via Pointer Events (mesmo mecanismo unificado
// mouse+toque do zoom de plantas em ZoomableImage.tsx). Arrastar mais que
// DRAG_THRESHOLD solta a navegação; um arrasto real (>8px) suprime o clique
// nativo do <a> na soltura, senão os dois disparariam juntos.
export function PropertyNavArrows({
  prevHref,
  nextHref,
  prevLabel,
  nextLabel,
}: {
  prevHref: string;
  nextHref: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const router = useRouter();
  const [dragDelta, setDragDelta] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const wasDragging = useRef(false);

  function handlePointerDown(e: React.PointerEvent<HTMLAnchorElement>) {
    dragStartX.current = e.clientX;
    wasDragging.current = false;
    // Alguns navegadores recusam capturar um ponteiro que não reconhecem
    // como ativo (visto em teste automatizado com PointerEvent sintético;
    // pode acontecer em casos reais também) — sem a captura, o arrasto
    // ainda funciona enquanto o dedo/cursor ficar sobre a própria seta, só
    // perde o "segue fora da caixinha", não vale travar a página por isso.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // captura indisponível — degrada graciosamente, ver comentário acima
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLAnchorElement>) {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > CLICK_SUPPRESS_THRESHOLD) wasDragging.current = true;
    setDragDelta(Math.max(-90, Math.min(90, delta)));
  }

  function handlePointerUp() {
    const delta = dragDelta;
    dragStartX.current = null;
    setDragDelta(0);
    if (delta <= -DRAG_THRESHOLD) router.push(nextHref);
    else if (delta >= DRAG_THRESHOLD) router.push(prevHref);
  }

  function handleClick(e: React.MouseEvent) {
    if (wasDragging.current) {
      e.preventDefault();
      wasDragging.current = false;
    }
  }

  const arrowClass =
    "pointer-events-auto touch-none flex h-11 w-11 items-center justify-center rounded-full text-white/60 opacity-70 transition-all duration-300 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)] hover:text-accent hover:drop-shadow-[0_0_12px_var(--color-accent)] md:opacity-0 md:group-hover:opacity-100";

  return (
    <>
      <div className="group pointer-events-none fixed left-0 top-1/2 z-20 flex h-28 w-16 -translate-y-1/2 items-center justify-start pl-1">
        <a
          href={prevHref}
          aria-label={`Imóvel anterior: ${prevLabel}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleClick}
          style={{ transform: `translateX(${dragDelta / 3}px)` }}
          className={arrowClass}
        >
          <ArrowIcon direction="prev" />
        </a>
      </div>
      <div className="group pointer-events-none fixed right-0 top-1/2 z-20 flex h-28 w-16 -translate-y-1/2 items-center justify-end pr-1">
        <a
          href={nextHref}
          aria-label={`Próximo imóvel: ${nextLabel}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleClick}
          style={{ transform: `translateX(${dragDelta / 3}px)` }}
          className={arrowClass}
        >
          <ArrowIcon direction="next" />
        </a>
      </div>
    </>
  );
}
