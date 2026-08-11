"use client";

import { useEffect, useRef, useState } from "react";

// Ponto de destaque que segue o mouse pelo site inteiro — só liga em
// mouse/trackpad de verdade (pointer: fine), nunca em toque, mesmo em telas
// largas onde um tablet com teclado passaria pelo antigo filtro só de
// largura. Cresce um pouco sobre links/botões.
//
// Pedido do Paulo (10/08): o cursor nativo do sistema (seta, mãozinha,
// barra de texto) não deve aparecer nunca — só esse pontinho, exceto dentro
// das galerias, onde o cursor customizado delas (useCustomCursor) assume.
// O cursor nativo global é escondido via classe no <html> (ver globals.css,
// regra ".cursor-none-global"), ligada só depois que este efeito confirma
// pointer:fine — se o JS falhar antes disso, a classe nunca é aplicada e o
// cursor nativo normal continua disponível (mesmo cuidado de antes).
// Zonas de galeria são marcadas com [data-gallery-cursor], não mais pelo
// valor computado de "cursor", pra não colidir com a classe global.
export function GlobalCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none-global");

    function handleMove(e: MouseEvent) {
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest("[data-gallery-cursor]")) {
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
      document.documentElement.classList.remove("cursor-none-global");
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
