"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Soma dos códigos do id — dá a cada card um ritmo ligeiramente diferente, pra
// os cards da Home/Portfólio não virarem de foto todos no mesmo instante.
function jitterFor(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return (h % 5) * 350;
}

// Fotos da capa de um card. Com `rotate` falso (ou uma foto só) é só a imagem;
// com `rotate` verdadeiro passa sozinha pelas fotos em fade cruzado (C-3):
// - só monta a próxima foto um passo antes de precisar (cada imagem carrega
//   uma vez, nada de baixar as 5 de uma vez);
// - só vira de foto enquanto o card está na tela (checa o retângulo a cada
//   tick, sem IntersectionObserver);
// - respeita "reduzir movimento" do sistema (fica só na capa).
export function CardCoverImages({
  photos,
  rotate,
  intervalMs,
  seed,
  alt,
  imageClassName,
}: {
  photos: string[];
  rotate: boolean;
  intervalMs: number;
  seed: string;
  alt: string;
  imageClassName: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const [previous, setPrevious] = useState<number | null>(null);
  // Maior índice que já entrou em cena — só monta até uma foto à frente dele
  // (a próxima fica pré-carregada, invisível); as demais nem são baixadas.
  const [highWater, setHighWater] = useState(0);
  const active = rotate && photos.length > 1;
  const mounted = active ? Math.min(photos.length, highWater + 2) : 1;

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      const rect = rootRef.current?.getBoundingClientRect();
      const onScreen = rect && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
      if (!onScreen) return;
      const current = indexRef.current;
      const next = (current + 1) % photos.length;
      indexRef.current = next;
      setPrevious(current);
      setIndex(next);
      setHighWater((h) => Math.max(h, next));
    }, intervalMs + jitterFor(seed));
    return () => window.clearInterval(id);
  }, [active, intervalMs, photos.length, seed]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      {photos.slice(0, mounted).map((src, i) => {
        const isCurrent = i === index;
        const isPrevious = i === previous;
        return (
          <Image
            key={src}
            src={src}
            alt={isCurrent ? alt : ""}
            fill
            draggable={false}
            sizes="(max-width: 768px) 100vw, 33vw"
            data-cover-active={isCurrent ? "true" : "false"}
            className={`${imageClassName} transition-[opacity,transform] duration-700 ${
              isCurrent ? "z-10 opacity-100" : isPrevious ? "z-0 opacity-100" : "z-0 opacity-0"
            }`}
          />
        );
      })}
    </div>
  );
}
