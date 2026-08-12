"use client";

import { useState, useTransition } from "react";
import { saveSellerCtaSettings } from "../integrations-actions";
import type { SellerCtaSettings } from "@/lib/settings";

export function SellerCtaForm({ initial }: { initial: SellerCtaSettings }) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      saveSellerCtaSettings({ enabled });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-border p-6">
      <h2 className="font-display text-lg text-accent">&quot;Está a Pensar Vender?&quot; (menu do site)</h2>
      <p className="text-sm text-foreground-muted">
        Link no menu do site (entre Sobre e Contacto) levando pra uma página própria com um formulário de
        contacto pra quem quer vender um imóvel — pedido do Rui. Desligado, o link some do menu e a página
        deixa de existir publicamente.
      </p>

      <label className="block">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setEnabled(true)}
            className={`flex-1 border px-4 py-3 text-sm transition-colors ${
              enabled ? "border-accent text-accent" : "border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            Ligado
          </button>
          <button
            type="button"
            onClick={() => setEnabled(false)}
            className={`flex-1 border px-4 py-3 text-sm transition-colors ${
              !enabled ? "border-accent text-accent" : "border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            Desligado
          </button>
        </div>
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
