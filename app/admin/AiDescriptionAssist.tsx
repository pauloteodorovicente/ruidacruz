"use client";

import { useRef, useState } from "react";
import { generateDescriptionAction } from "./ai-actions";

const inputClass =
  "w-full bg-transparent border border-border px-3 py-2.5 text-sm placeholder:text-foreground-muted focus:border-accent outline-none transition-colors";
const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1.5";

// Lê o resto do formulário (título, tipo, zona, áreas) via FormData no
// momento do clique, em vez de duplicar esses campos em estado do React —
// eles já existem como inputs não-controlados no formulário pai. Aceitar o
// texto gerado escreve direto no textarea de Descrição pelo mesmo motivo
// (é não-controlado); nunca substitui nada sozinho, sempre precisa do
// clique em "Usar este texto".
export function AiDescriptionAssist() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  function getForm(): HTMLFormElement | null {
    return containerRef.current?.closest("form") ?? null;
  }

  function handleGenerate() {
    const form = getForm();
    if (!form) return;
    const data = new FormData(form);
    const context = {
      title: String(data.get("title") ?? ""),
      propertyType: String(data.get("property_type") ?? ""),
      zone: String(data.get("zone") ?? "") || null,
      municipality: String(data.get("municipality") ?? "") || null,
      typology: String(data.get("typology") ?? "") || null,
      constructionAreaSqm: data.get("construction_area_sqm") ? Number(data.get("construction_area_sqm")) : null,
      landAreaSqm: data.get("land_area_sqm") ? Number(data.get("land_area_sqm")) : null,
    };
    setError(null);
    setPreview(null);
    setIsPending(true);
    generateDescriptionAction(notes, context).then((result) => {
      setIsPending(false);
      if ("error" in result) setError(result.error);
      else setPreview(result.text);
    });
  }

  function handleAccept() {
    const form = getForm();
    const textarea = form?.querySelector<HTMLTextAreaElement>('textarea[name="description"]');
    if (textarea && preview) {
      textarea.value = preview;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
    setPreview(null);
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-3 border border-border p-4">
      <div>
        <span className={labelClass}>Notas soltas pro rascunho por IA (opcional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Ex.: cozinha reformada em 2023, vista desafogada, perto do metro…"
          className={inputClass}
        />
      </div>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isPending}
        className="self-start text-xs tracking-[0.08em] uppercase text-accent hover:text-accent-strong transition-colors disabled:opacity-50"
      >
        {isPending ? "A gerar…" : "Gerar parágrafo com IA →"}
      </button>
      {error && (
        <p className="text-sm" style={{ color: "#a13f3f" }}>
          {error}
        </p>
      )}
      {preview && (
        <div className="flex flex-col gap-2">
          <span className={labelClass}>Pré-visualização — edite antes de aceitar</span>
          <textarea value={preview} onChange={(e) => setPreview(e.target.value)} rows={4} className={inputClass} />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleAccept}
              className="text-xs tracking-[0.08em] uppercase text-accent hover:text-accent-strong transition-colors"
            >
              Usar este texto
            </button>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors"
            >
              Descartar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
