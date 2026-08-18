"use client";

import { useState, useTransition } from "react";
import { saveSchedulingSettings } from "../integrations-actions";
import type { SchedulingSettings } from "@/lib/settings";

const inputClass =
  "w-full bg-transparent border border-border px-3 py-2.5 text-sm placeholder:text-foreground-muted focus:border-accent outline-none transition-colors";
const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1.5";

export function SchedulingForm({ initial }: { initial: SchedulingSettings }) {
  const [link, setLink] = useState(initial.link);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      saveSchedulingSettings({ link: link.trim() });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-border p-6">
      <h2 className="font-display text-lg text-accent">Agendar Chamada</h2>
      <p className="text-sm text-foreground-muted">
        Link de agendamento (Calendly ou similar). Enquanto vazio, o botão &quot;Agendar Chamada&quot; não aparece no
        site, ao lado do WhatsApp.
      </p>

      <label className="block">
        <span className={labelClass}>Link</span>
        <input
          className={inputClass}
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://calendly.com/..."
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
