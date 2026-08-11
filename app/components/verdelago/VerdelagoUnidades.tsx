"use client";

import { useMemo, useState } from "react";
import { useVerdelagoLanguage } from "@/lib/verdelago-language-context";
import { Reveal } from "../Reveal";

export type VerdelagoUnitRow = { lote: string | null; fracao: string | null; tipologia: string; valor: number | null };
export type VerdelagoPhaseGroup = { label: string; units: VerdelagoUnitRow[] };

type SortKey = "lote" | "fracao" | "tipologia" | "valor";
type SortDir = "asc" | "desc";

function compare(a: VerdelagoUnitRow, b: VerdelagoUnitRow, key: SortKey): number {
  if (key === "valor") return (a.valor ?? Infinity) - (b.valor ?? Infinity);
  const av = a[key] ?? "";
  const bv = b[key] ?? "";
  return av.localeCompare(bv, "pt-PT", { numeric: true });
}

function SortButton({
  label,
  active,
  dir,
  onClick,
  align,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  align?: "right";
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 hover:text-foreground transition-colors ${align === "right" ? "flex-row-reverse" : ""}`}
    >
      {label}
      <span className={`text-[9px] transition-opacity ${active ? "opacity-100 text-accent" : "opacity-30"}`}>
        {active && dir === "desc" ? "↓" : "↑"}
      </span>
    </button>
  );
}

// Recebe as fases já agrupadas por prop (vem do banco, via property_units +
// property_typologies — ver app/verdelago/page.tsx) em vez de importar
// lib/verdelago-units.ts, que era um arquivo de código fixo — agora editável
// pelo admin (Fase 23). Mantém a mesma forma de dados de propósito, pra não
// precisar mexer em mais nada aqui embaixo.
//
// Legenda explicando Lote/Fração/Tipologia e ordenação por coluna — pedido
// do Paulo (10/08) depois de achar os códigos confusos ("T2A", "0B" etc.):
// é terminologia real do registo predial português, mas não é óbvia pra
// quem não é do mercado local. Rótulos traduzidos nas 7 línguas (Paulo
// percebeu, 10/08, que essa seção não trocava de idioma).
export function VerdelagoUnidades({ verdelagoPhases }: { verdelagoPhases: VerdelagoPhaseGroup[] }) {
  const { t, locale } = useVerdelagoLanguage();
  const u = t.unidades;
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function formatPrice(valor: number | null) {
    if (valor === null) return u.brevemente;
    return valor.toLocaleString(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  }

  function toggleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  }

  const sortedPhases = useMemo(() => {
    if (!sortKey) return verdelagoPhases;
    return verdelagoPhases.map((phase) => ({
      ...phase,
      units: [...phase.units].sort((a, b) => (sortDir === "asc" ? compare(a, b, sortKey) : compare(b, a, sortKey))),
    }));
  }, [verdelagoPhases, sortKey, sortDir]);

  return (
    <section className="bg-background-raised px-6 py-14 md:px-12 md:py-20 border-y border-border">
      <Reveal className="mx-auto max-w-4xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{u.eyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-4">{u.title}</h2>
        <p className="text-sm text-foreground-muted mb-4 max-w-xl">{u.description}</p>

        <details className="mb-6 border border-border bg-background text-sm">
          <summary className="cursor-pointer select-none px-4 py-3 text-xs tracking-[0.05em] uppercase text-accent">
            {u.legendToggle} ⌄
          </summary>
          <dl className="px-4 pb-4 pt-1 flex flex-col gap-2.5 text-foreground-muted">
            <div>
              <dt className="inline font-medium text-foreground">{u.legendLoteLabel} — </dt>
              <dd className="inline">{u.legendLoteText}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">{u.legendFracaoLabel} — </dt>
              <dd className="inline">{u.legendFracaoText}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">{u.legendTipologiaLabel} — </dt>
              <dd className="inline">{u.legendTipologiaText}</dd>
            </div>
          </dl>
        </details>

        <div className="flex flex-col gap-3">
          {sortedPhases.map((phase, phaseIndex) => (
            <details key={phase.label} className="border border-border bg-background group" open={phaseIndex === 0}>
              <summary className="cursor-pointer select-none px-5 py-4 flex items-center justify-between text-sm">
                <span className="font-display text-lg">{phase.label}</span>
                <span className="text-xs text-foreground-muted">
                  {phase.units.length} {u.fracoesLabel} · {u.verTodas} ↓
                </span>
              </summary>
              <div className="border-t border-border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] tracking-[0.08em] uppercase text-foreground-muted">
                      <th className="px-5 py-3 font-normal">
                        <SortButton label={u.colLote} active={sortKey === "lote"} dir={sortDir} onClick={() => toggleSort("lote")} />
                      </th>
                      <th className="px-5 py-3 font-normal">
                        <SortButton label={u.colFracao} active={sortKey === "fracao"} dir={sortDir} onClick={() => toggleSort("fracao")} />
                      </th>
                      <th className="px-5 py-3 font-normal">
                        <SortButton label={u.colTipologia} active={sortKey === "tipologia"} dir={sortDir} onClick={() => toggleSort("tipologia")} />
                      </th>
                      <th className="px-5 py-3 font-normal text-right">
                        <SortButton label={u.colValor} active={sortKey === "valor"} dir={sortDir} onClick={() => toggleSort("valor")} align="right" />
                      </th>
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
