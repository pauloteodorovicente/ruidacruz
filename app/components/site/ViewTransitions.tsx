"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { flushSync } from "react-dom";

// Cross-fade entre páginas (Home/Imóvel/Sobre/Contacto/Portfólio) via View
// Transitions API nativa do navegador — sem biblioteca nova. Guarda o
// conteúdo já renderizado num estado próprio; quando a rota muda de
// verdade, troca esse estado por dentro de startViewTransition (com
// flushSync, senão o React adia o commit e a transição já teria acabado
// antes do DOM mudar). Se o navegador não suporta (Firefox/Safari ainda
// não têm) ou o visitante pediu menos movimento, troca na hora, sem
// transição — nunca trava a navegação por causa disso.
export function ViewTransitions({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current === pathname) {
      setDisplayChildren(children);
      return;
    }
    prevPathname.current = pathname;

    const supportsViewTransition = typeof document.startViewTransition === "function";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!supportsViewTransition || reducedMotion) {
      setDisplayChildren(children);
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => setDisplayChildren(children));
    });
    // Navegar de novo antes da transição anterior terminar é normal (clique
    // duplo, troca rápida de página) — o navegador "pula" a mais antiga, o
    // que rejeita a promise .ready dela com InvalidStateError (.finished
    // resolve normalmente mesmo assim). Sem isto aqui, sobra como unhandled
    // rejection solto no console; peguei as duas por segurança.
    transition.ready.catch(() => {});
    transition.finished.catch(() => {});
  }, [pathname, children]);

  return displayChildren;
}
