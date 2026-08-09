"use client";

import { useState, useTransition } from "react";
import { saveMetaPixelSettings } from "../integrations-actions";
import type { MetaPixelSettings } from "@/lib/settings";

const inputClass =
  "w-full bg-transparent border border-border px-3 py-2.5 text-sm placeholder:text-foreground-muted focus:border-accent outline-none transition-colors";
const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1.5";

export function MetaPixelForm({
  initial,
  pageOptions,
}: {
  initial: MetaPixelSettings;
  pageOptions: { value: string; label: string }[];
}) {
  const [pixelId, setPixelId] = useState(initial.pixelId);
  const [autoInstall, setAutoInstall] = useState(initial.autoInstallNewPages);
  const [pages, setPages] = useState<string[]>(initial.pages);
  const [isPending, startTransition] = useTransition();

  function togglePage(value: string) {
    setPages((prev) => (prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      saveMetaPixelSettings({ pixelId: pixelId.trim(), pages, autoInstallNewPages: autoInstall });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-border p-6">
      <h2 className="font-display text-lg text-accent">Meta Pixel</h2>

      <label className="block">
        <span className={labelClass}>Pixel ID</span>
        <input
          className={inputClass}
          value={pixelId}
          onChange={(e) => setPixelId(e.target.value)}
          placeholder="0000000000000000"
        />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={autoInstall} onChange={(e) => setAutoInstall(e.target.checked)} />
        <span className="text-sm">Instalar automaticamente em página nova</span>
      </label>

      <div>
        <span className={labelClass}>
          {autoInstall
            ? "Instalado em todas as páginas (exceto o painel) — desligue acima pra escolher só algumas"
            : "Instalar só nestas páginas"}
        </span>
        <div className={`grid grid-cols-2 gap-2 mt-2 ${autoInstall ? "opacity-40 pointer-events-none" : ""}`}>
          {pageOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={pages.includes(opt.value)} onChange={() => togglePage(opt.value)} />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="self-start px-6 py-2.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong disabled:opacity-50"
      >
        {isPending ? "A guardar..." : "Guardar"}
      </button>
    </form>
  );
}
