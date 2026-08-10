"use client";

import { Reveal } from "../Reveal";

export type VerdelagoFeaturedUnit = {
  id: string;
  tipologia: string;
  lote: string | null;
  fracao: string | null;
  valor: number | null;
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
export function VerdelagoFeatured({ units }: { units: VerdelagoFeaturedUnit[] }) {
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
            <div key={unit.id} className="border border-border p-5">
              <p className="font-display text-lg mb-1">{unit.tipologia}</p>
              <p className="text-xs text-foreground-muted mb-4">
                {unit.lote && `Lote ${unit.lote}`}
                {unit.lote && unit.fracao && " · "}
                {unit.fracao && `Fração ${unit.fracao}`}
              </p>
              <p className="font-display text-xl text-accent">{formatPrice(unit.valor)}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
