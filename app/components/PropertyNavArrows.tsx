"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { NeighborArrow } from "@/lib/property-neighbors";
import { trackLinkClick } from "@/lib/track-event";

const DRAG_THRESHOLD = 60;
const CLICK_SUPPRESS_THRESHOLD = 8;

function ArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      {direction === "prev" ? (
        <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

// Setas nas bordas da tela para o imóvel anterior e o próximo, em todas as páginas de imóvel (a
// ficha e as landings de campanha). Cada seta é um <a> de verdade (funciona sem JavaScript e com
// "abrir em nova aba") e, por cima disso:
//  - usa a cor de destaque da PRÓPRIA página (azul-marinho numa página marinho, creme numa creme...) e mostra o
//    nome do vizinho ao passar o mouse;
//  - ao clicar ou arrastar, a página desliza para o lado (a atual sai, a outra entra) em vez de
//    recarregar: a direção vai em html[data-nav-dir], e o CSS de globals.css faz a animação com a View
//    Transitions API (ver ViewTransitions.tsx; sem suporte, ou com "reduzir movimento", troca direto);
//  - arrastar a própria seta mais que DRAG_THRESHOLD também navega (mesmo gesto mouse+toque de antes).
export function PropertyNavArrows({ prev, next }: { prev: NeighborArrow; next: NeighborArrow }) {
  const router = useRouter();
  const [dragDelta, setDragDelta] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const wasDragging = useRef(false);

  function go(target: NeighborArrow, direction: "prev" | "next") {
    document.documentElement.dataset.navDir = direction;
    trackLinkClick(direction === "next" ? "seta_proximo" : "seta_anterior");
    router.push(target.href);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLAnchorElement>) {
    dragStartX.current = e.clientX;
    wasDragging.current = false;
    // Alguns navegadores recusam capturar um ponteiro que não reconhecem como ativo; sem a captura o
    // arrasto ainda funciona enquanto o cursor ficar sobre a seta, então não vale travar por isso.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // captura indisponível: degrada sem erro
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
    if (delta <= -DRAG_THRESHOLD) go(next, "next");
    else if (delta >= DRAG_THRESHOLD) go(prev, "prev");
  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, target: NeighborArrow, direction: "prev" | "next") {
    if (wasDragging.current) {
      e.preventDefault();
      wasDragging.current = false;
      return;
    }
    // Ctrl/Cmd/Shift/botão do meio: deixa o navegador abrir em outra aba do jeito dele.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(target, direction);
  }

  const style = (): React.CSSProperties => ({ transform: `translateX(${dragDelta / 3}px)` });

  return (
    <>
      <div className="nav-arrow-zone nav-arrow-zone-prev">
        <a
          href={prev.href}
          aria-label={`Imóvel anterior: ${prev.title}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={(e) => handleClick(e, prev, "prev")}
          style={style()}
          className="nav-arrow nav-arrow-prev"
        >
          <ArrowIcon direction="prev" />
          <span className="nav-arrow-label" aria-hidden="true">
            {prev.title}
          </span>
        </a>
      </div>
      <div className="nav-arrow-zone nav-arrow-zone-next">
        <a
          href={next.href}
          aria-label={`Próximo imóvel: ${next.title}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={(e) => handleClick(e, next, "next")}
          style={style()}
          className="nav-arrow nav-arrow-next"
        >
          <ArrowIcon direction="next" />
          <span className="nav-arrow-label" aria-hidden="true">
            {next.title}
          </span>
        </a>
      </div>
    </>
  );
}
