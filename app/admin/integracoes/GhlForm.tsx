"use client";

import { useState, useTransition } from "react";
import { saveGhlSettings } from "../integrations-actions";
import type { GhlSettings } from "@/lib/settings";

const inputClass =
  "w-full bg-transparent border border-border px-3 py-2.5 text-sm placeholder:text-foreground-muted focus:border-accent outline-none transition-colors";
const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1.5";

export function GhlForm({ initial }: { initial: GhlSettings | null }) {
  const [apiToken, setApiToken] = useState(initial?.apiToken ?? "");
  const [locationId, setLocationId] = useState(initial?.locationId ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      saveGhlSettings({ apiToken: apiToken.trim(), locationId: locationId.trim() });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-border p-6">
      <h2 className="font-display text-lg text-accent">GoHighLevel (CRM)</h2>
      {!initial && (
        <p className="text-sm text-foreground-muted">
          Ainda não configurado — os formulários de contacto do site não vão funcionar até preencher os dois campos abaixo.
        </p>
      )}

      <label className="block">
        <span className={labelClass}>Token de API (Private Integration)</span>
        <input
          type="password"
          className={inputClass}
          value={apiToken}
          onChange={(e) => setApiToken(e.target.value)}
          placeholder="pit-..."
          autoComplete="off"
        />
      </label>

      <label className="block">
        <span className={labelClass}>Location ID</span>
        <input
          className={inputClass}
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          autoComplete="off"
        />
      </label>

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
