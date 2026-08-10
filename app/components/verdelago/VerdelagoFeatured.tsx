"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal } from "../Reveal";
import { ZoomableImage } from "../ZoomableImage";

export type VerdelagoFeaturedUnit = {
  id: string;
  tipologia: string;
  lote: string | null;
  fracao: string | null;
  valor: number | null;
  plantaSrc: string | null;
};

function formatPrice(valor: number | null) {
  if (valor === null) return "Brevemente";
  return valor.toLocaleString("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

// Seleção curada manualmente pelo Rui/Paulo no admin (checkbox "Destacar" em
// cada unidade, ver UnitsManager.tsx) — pedido dele por áudio (10/08): em vez
// de só a tabela completa de 59 frações, mostrar logo 3-4 opções
// representativas (ex. o T3, um T2 mais barato, um T2 intermédio). Fica
// acima da tabela completa (VerdelagoUnidades), que continua existindo pra
// quem quiser ver tudo.
//
// Cada card mostra a planta da tipologia (não existe foto por unidade —
// ainda não construído) — clicável, abre ampliada com zoom/pan. Resolve o
// "ficou vazio" apontado pelo Paulo (10/08): a planta é o que de fato
// diferencia uma tipologia da outra, mais do que o nome/código sozinho.
export function VerdelagoFeatured({ units }: { units: VerdelagoFeaturedUnit[] }) {
  const [open, setOpen] = useState<VerdelagoFeaturedUnit | null>(null);

  if (units.length === 0) return null;

  return (
    <section className="px-6 py-14 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-4xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">Opções em Destaque</p>
        <h2 className="font-display text-3xl md:text-4xl mb-4">Algumas escolhas para começar</h2>
        <p className="text-sm text-foreground-muted mb-10 max-w-xl">
          Uma seleção rápida dentro das unidades disponíveis — a tabela completa está mais abaixo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {units.map((unit) => (
            <div key={unit.id} className="border border-border overflow-hidden">
              {unit.plantaSrc && (
                <button
                  onClick={() => setOpen(unit)}
                  className="relative block aspect-[4/3] w-full bg-background-raised group cursor-zoom-in"
                  aria-label={`Ver planta ampliada — ${unit.tipologia}`}
                >
                  <Image
                    src={unit.plantaSrc}
                    alt={`Planta — ${unit.tipologia}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </button>
              )}
              <div className="p-5">
                <p className="font-display text-lg mb-1">{unit.tipologia}</p>
                <p className="text-xs text-foreground-muted mb-4">
                  {unit.lote && `Lote ${unit.lote}`}
                  {unit.lote && unit.fracao && " · "}
                  {unit.fracao && `Fração ${unit.fracao}`}
                </p>
                <p className="font-display text-xl text-accent">{formatPrice(unit.valor)}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {open?.plantaSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 md:p-12"
          onClick={() => setOpen(null)}
        >
          <button
            onClick={() => setOpen(null)}
            aria-label="Fechar"
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center text-white/70 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
          <p className="mb-3 text-sm tracking-[0.08em] uppercase text-white/70 z-10">{open.tipologia}</p>
          <div className="relative w-full flex-1 bg-[#f4f2ee] min-h-0" onClick={(e) => e.stopPropagation()}>
            <ZoomableImage key={open.id} src={open.plantaSrc} alt={`Planta — ${open.tipologia}`} />
          </div>
        </div>
      )}
    </section>
  );
}
