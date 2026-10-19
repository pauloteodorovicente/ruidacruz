"use client";

import { useMemo, useState, useTransition } from "react";
import { saveContentEdits, translateContentEdits } from "../content-actions";

type Entry = { path: string; value: string };

const inputClass =
  "w-full bg-background-raised border border-border px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none";

// Editor de textos de UMA página em UM idioma. Cada campo mostra o texto que está no site agora (o padrão ou a
// sua edição). Só o que for diferente do original é guardado como edição; "Voltar ao original" desfaz.
export function ContentEditor({
  source,
  locale,
  entries,
  edited,
  ptEditedCount,
}: {
  source: string;
  locale: string;
  entries: Entry[];
  edited: Record<string, string>;
  ptEditedCount: number;
}) {
  const defaults = useMemo(() => new Map(entries.map((e) => [e.path, e.value])), [entries]);
  // Valor mostrado em cada campo: a edição guardada ou o texto original.
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(entries.map((e) => [e.path, edited[e.path] ?? e.value])),
  );
  // O que já está guardado como edição (muda depois de Guardar).
  const [saved, setSaved] = useState<Record<string, string>>(edited);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [ptCount, setPtCount] = useState(ptEditedCount);

  const normalized = query.trim().toLowerCase();
  const visible = normalized
    ? entries.filter((e) => e.path.toLowerCase().includes(normalized) || (values[e.path] ?? "").toLowerCase().includes(normalized))
    : entries;

  const groups = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const entry of visible) {
      const section = entry.path.split(".")[0];
      map.set(section, [...(map.get(section) ?? []), entry]);
    }
    return Array.from(map.entries());
  }, [visible]);

  // Alterações ainda não guardadas.
  const pending = useMemo(() => {
    const set: Record<string, string> = {};
    const clear: string[] = [];
    for (const entry of entries) {
      const now = values[entry.path];
      const isEdit = now !== entry.value;
      const wasEdit = entry.path in saved;
      if (isEdit && saved[entry.path] !== now) set[entry.path] = now;
      if (!isEdit && wasEdit) clear.push(entry.path);
    }
    return { set, clear };
  }, [entries, values, saved]);
  const pendingCount = Object.keys(pending.set).length + pending.clear.length;

  function handleSave() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      try {
        const result = await saveContentEdits(source, locale, pending.set, pending.clear);
        const next: Record<string, string> = {};
        for (const entry of entries) if (values[entry.path] !== entry.value) next[entry.path] = values[entry.path];
        setSaved(next);
        if (locale === "pt-PT") setPtCount(result.edited);
        setMessage(`Guardado ✓ (${result.edited} texto${result.edited === 1 ? "" : "s"} editado${result.edited === 1 ? "" : "s"} neste idioma). Aparece no site em até 1 minuto.`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao guardar.");
      }
    });
  }

  function handleTranslate() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      try {
        const result = await translateContentEdits(source);
        setMessage(`${result.translated} tradução${result.translated === 1 ? "" : "ões"} guardada${result.translated === 1 ? "" : "s"} nos outros 6 idiomas. Aparece no site em até 1 minuto.`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao traduzir.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6" data-testid="content-editor">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border border-border bg-background px-4 py-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar um texto ou um campo"
          aria-label="Buscar um texto ou um campo"
          className={`${inputClass} max-w-xs`}
        />
        <span className="text-xs text-foreground-muted">
          {entries.length} textos · {Object.keys(saved).length} editados neste idioma
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || pendingCount === 0}
          className="ml-auto px-5 py-2.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong disabled:opacity-50"
        >
          {isPending ? "A guardar..." : pendingCount > 0 ? `Guardar (${pendingCount})` : "Guardar"}
        </button>
      </div>

      {message && <p className="text-sm text-accent">{message}</p>}
      {error && (
        <p className="text-sm" style={{ color: "#a13f3f" }}>
          {error}
        </p>
      )}

      {locale === "pt-PT" && (
        <div className="flex flex-col gap-2 border border-border p-4 text-sm">
          <p className="text-foreground-muted">
            Depois de guardar as edições em português de Portugal, traduza-as de uma vez para os outros 6 idiomas (tradução
            automática; você pode ajustar cada idioma depois). {ptCount} texto{ptCount === 1 ? "" : "s"} editado
            {ptCount === 1 ? "" : "s"} em português.
          </p>
          <button
            type="button"
            onClick={handleTranslate}
            disabled={isPending || ptCount === 0 || pendingCount > 0}
            className="self-start px-4 py-2 border border-border text-xs tracking-[0.08em] uppercase hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
          >
            Traduzir minhas edições para os outros idiomas
          </button>
          {pendingCount > 0 && <p className="text-xs text-foreground-muted">Guarde as alterações antes de traduzir.</p>}
        </div>
      )}

      {groups.length === 0 && <p className="text-sm text-foreground-muted">Nenhum texto encontrado.</p>}

      {groups.map(([section, items]) => {
        const editedHere = items.filter((e) => values[e.path] !== e.value).length;
        return (
          <details key={section} className="border border-border" open={normalized.length > 0}>
            <summary className="flex cursor-pointer select-none items-center justify-between px-4 py-3 text-sm">
              <span className="font-display text-base">{section}</span>
              <span className="text-xs text-foreground-muted">
                {items.length} textos{editedHere > 0 ? ` · ${editedHere} editado${editedHere === 1 ? "" : "s"}` : ""}
              </span>
            </summary>
            <div className="flex flex-col gap-4 border-t border-border p-4">
              {items.map((entry) => {
                const value = values[entry.path] ?? entry.value;
                const changed = value !== (defaults.get(entry.path) ?? "");
                const long = entry.value.length > 80 || value.length > 80 || value.includes("\n");
                return (
                  <div key={entry.path} className="flex flex-col gap-1.5">
                    <label htmlFor={`c-${entry.path}`} className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.06em] text-foreground-muted">
                      <span className="break-all">{entry.path.slice(section.length + 1) || section}</span>
                      {changed && <span className="border border-accent/40 px-1.5 py-0.5 text-accent uppercase">editado</span>}
                    </label>
                    {long ? (
                      <textarea
                        id={`c-${entry.path}`}
                        value={value}
                        rows={Math.min(8, Math.max(3, Math.ceil(value.length / 90)))}
                        onChange={(e) => setValues((prev) => ({ ...prev, [entry.path]: e.target.value }))}
                        className={inputClass}
                      />
                    ) : (
                      <input
                        id={`c-${entry.path}`}
                        value={value}
                        onChange={(e) => setValues((prev) => ({ ...prev, [entry.path]: e.target.value }))}
                        className={inputClass}
                      />
                    )}
                    {changed && (
                      <button
                        type="button"
                        onClick={() => setValues((prev) => ({ ...prev, [entry.path]: entry.value }))}
                        className="self-start text-xs underline underline-offset-2 text-foreground-muted hover:text-accent"
                      >
                        Voltar ao original
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}
