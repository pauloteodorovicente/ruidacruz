"use client";

import { useEffect, useRef, useState } from "react";

// Ponto de destaque que segue o mouse pelo site inteiro — só liga em
// mouse/trackpad de verdade (pointer: fine), nunca em toque, mesmo em telas
// largas onde um tablet com teclado passaria pelo antigo filtro só de
// largura. Cresce um pouco sobre links/botões, dá uma "assinatura" de
// interação sutil sem substituir o cursor nativo (diferente do
// useCustomCursor da galeria, que troca o cursor inteiro dentro da área de
// hover — aqui é global, então trocar o cursor nativo seria arriscado
// demais: qualquer travamento de JS deixaria o visitante sem cursor
// nenhum). Some sozinho sobre qualquer elemento que já use cursor-none (as
// próprias galerias), pra não sobrepor o cursor customizado delas.
export function GlobalCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    function handleMove(e: MouseEvent) {
      const target = e.target instanceof Element ? e.target : null;
      if (target && getComputedStyle(target).cursor === "none") {
        setVisible(false);
        return;
      }
      const dot = dotRef.current;
      if (dot) dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      setVisible(true);
      setActive(!!target?.closest("a, button, input, textarea, select, [role='button']"));
    }
    function handleLeave() {
      setVisible(false);
    }

    window.addEventListener("mousemove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className={`pointer-events-none fixed top-0 left-0 z-[9990] rounded-full bg-accent transition-[opacity,width,height] duration-200 ease-out ${
        visible ? "opacity-60" : "opacity-0"
      } ${active ? "h-6 w-6" : "h-2.5 w-2.5"}`}
    />
  );
}
