"use client";

import { useRef, useState } from "react";

// Cursor customizado que acompanha o mouse dentro de uma área — validado na
// galeria da Leça do Balio, extraído pra reusar em qualquer grid de mídia
// futuro (ex.: fotos do imóvel no template genérico da Fase 5).
export function useCustomCursor<T extends HTMLElement>() {
  const areaRef = useRef<T>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  function handleMouseMove(e: React.MouseEvent<T>) {
    const area = areaRef.current;
    const cursor = cursorRef.current;
    if (!area || !cursor) return;
    const rect = area.getBoundingClientRect();
    cursor.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px) translate(-50%, -50%)`;
  }

  return { areaRef, cursorRef, hovering, setHovering, handleMouseMove };
}
