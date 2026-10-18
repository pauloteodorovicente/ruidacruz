"use client";

import { useState, useTransition } from "react";
import { saveVerdelagoPhaseNotes } from "../integrations-actions";

const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1.5";
const inputClass =
  "w-full bg-background-raised border border-border px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none";

type Row = { phase: string; text: string };

// Nota curta por fase do Verdelago (aparece no card da fase e acima da tabela de
// frações em /verdelago). Escreve-se em português de Portugal; ao guardar, o texto é
// traduzido automaticamente para os outros 6 idiomas. O nome da fase tem de ser igual
// ao que está nas frações (ex.: "Fase 4").
export function VerdelagoPhaseNotesForm({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [baseline, setBaseline] = useState<string>(JSON.stringify(initial));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const unchanged = JSON.stringify(rows) === baseline;

  function update(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        const result = await saveVerdelagoPhaseNotes(rows);
        setRows(result.rows);
        setBaseline(JSON.stringify(result.rows));
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao guardar.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 border border-border p-6">
      <h2 className="font-display text-lg text-accent">Notas das fases do Verdelago</h2>
      <p className="text-sm text-foreground-muted">
        Uma frase curta por fase, mostrada no card da fase e acima da tabela de frações em /verdelago. Escreva em
        português de Portugal: ao guardar, o texto é traduzido automaticamente para os outros 6 idiomas. O nome da
        fase tem de ser igual ao das frações (por exemplo, “Fase 4”).
      </p>

      {rows.map((row, index) => (
        <div key={index} className="grid gap-3 md:grid-cols-[140px_1fr_auto] md:items-end">
          <div>
            <label className={labelClass} htmlFor={`phase-name-${index}`}>
              Fase
            </label>
            <input
              id={`phase-name-${index}`}
              className={inputClass}
              value={row.phase}
              maxLength={40}
              onChange={(e) => update(index, { phase: e.target.value })}
              placeholder="Fase 4"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor={`phase-text-${index}`}>
              Nota
            </label>
            <input
              id={`phase-text-${index}`}
              className={inputClass}
              value={row.text}
              maxLength={200}
              onChange={(e) => update(index, { text: e.target.value })}
              placeholder="Termina construção no 1.º semestre de 2027 · últimas unidades"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setRows((prev) => prev.filter((_, i) => i !== index));
              setSaved(false);
            }}
            className="px-3 py-2 text-xs tracking-[0.05em] uppercase text-foreground-muted border border-border transition-colors hover:text-foreground"
          >
            Remover
          </button>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => {
            setRows((prev) => [...prev, { phase: "", text: "" }]);
            setSaved(false);
          }}
          className="px-4 py-2 text-xs tracking-[0.05em] uppercase text-accent border border-accent/40 transition-colors hover:border-accent"
        >
          Adicionar fase
        </button>
        <button
          type="submit"
          disabled={isPending || unchanged}
          className="px-6 py-2.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong disabled:opacity-50"
        >
          {isPending ? "A guardar e a traduzir..." : "Guardar"}
        </button>
        {saved && <span className="text-sm text-accent">Guardado ✓ (aparece no site em até 1 minuto)</span>}
      </div>
      {error && (
        <p className="text-sm" style={{ color: "#a13f3f" }}>
          {error}
        </p>
      )}
    </form>
  );
}
