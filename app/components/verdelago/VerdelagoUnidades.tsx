"use client";

import { Reveal } from "../Reveal";

export type VerdelagoUnitRow = { lote: string | null; fracao: string | null; tipologia: string; valor: number | null };
export type VerdelagoPhaseGroup = { label: string; units: VerdelagoUnitRow[] };

function formatPrice(valor: number | null) {
  if (valor === null) return "Brevemente";
  return valor.toLocaleString("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

// Recebe as fases já agrupadas por prop (vem do banco, via property_units +
// property_typologies — ver app/verdelago/page.tsx) em vez de importar
// lib/verdelago-units.ts, que era um arquivo de código fixo — agora editável
// pelo admin (Fase 23). Mantém a mesma forma de dados de propósito, pra não
// precisar mexer em mais nada aqui embaixo.
export function VerdelagoUnidades({ verdelagoPhases }: { verdelagoPhases: VerdelagoPhaseGroup[] }) {
  return (
    <section className="bg-background-raised px-6 py-14 md:px-12 md:py-20 border-y border-border">
      <Reveal className="mx-auto max-w-4xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">Unidades</p>
        <h2 className="font-display text-3xl md:text-4xl mb-4">Unidades Disponíveis</h2>
        <p className="text-sm text-foreground-muted mb-10 max-w-xl">
          Frações disponíveis por fase, com tipologia e valor. Fase 6 com valores a confirmar em breve.
        </p>

        <div className="flex flex-col gap-3">
          {verdelagoPhases.map((phase) => (
            <details key={phase.label} className="border border-border bg-background group" open={phase === verdelagoPhases[0]}>
              <summary className="cursor-pointer select-none px-5 py-4 flex items-center justify-between text-sm">
                <span className="font-display text-lg">{phase.label}</span>
                <span className="text-xs text-foreground-muted">{phase.units.length} frações · ver todas ↓</span>
              </summary>
              <div className="border-t border-border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] tracking-[0.08em] uppercase text-foreground-muted">
                      <th className="px-5 py-3 font-normal">Lote</th>
                      <th className="px-5 py-3 font-normal">Fração</th>
                      <th className="px-5 py-3 font-normal">Tipologia</th>
                      <th className="px-5 py-3 font-normal text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phase.units.map((unit, i) => (
                      <tr key={`${unit.lote}-${unit.fracao}-${i}`} className="border-t border-border">
                        <td className="px-5 py-2.5 text-foreground-muted">{unit.lote}</td>
                        <td className="px-5 py-2.5 text-foreground-muted">{unit.fracao}</td>
                        <td className="px-5 py-2.5">{unit.tipologia}</td>
                        <td className="px-5 py-2.5 text-right text-accent">{formatPrice(unit.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
