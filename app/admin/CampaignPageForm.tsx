"use client";

import { useState } from "react";
import { saveCampaignPage } from "./actions";
import type { Property } from "@/lib/property-types";

const inputClass =
  "w-full bg-transparent border border-border px-3 py-2.5 text-sm placeholder:text-foreground-muted focus:border-accent outline-none transition-colors";
const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1.5";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

export function CampaignPageForm({ property }: { property: Property }) {
  const [priceOnApplication, setPriceOnApplication] = useState(property.price_on_application);

  return (
    <form action={saveCampaignPage} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={property.id} />
      <input type="hidden" name="campaign_path" value={property.campaign_path ?? ""} />

      <div className="border border-dashed border-accent/40 bg-accent/5 p-4 text-sm text-foreground-muted leading-relaxed">
        Esta é uma landing própria, com layout e textos definidos no código — não dá pra editar fotos, narrativa ou
        comodidades por aqui. O que você altera abaixo controla só o título/zona/preço que aparecem no card da Home,
        e se a página em <code className="text-accent">{property.campaign_path}</code> fica publicada ou sai do ar.
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Título (card da Home)">
          <input name="title" defaultValue={property.title} required className={inputClass} />
        </Field>
        <Field label="Zona (card da Home)">
          <input name="zone" defaultValue={property.zone ?? ""} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 self-end pb-2.5">
          <input
            type="checkbox"
            checked={priceOnApplication}
            onChange={(e) => setPriceOnApplication(e.target.checked)}
            name="price_on_application"
          />
          <span className="text-sm">Preço Sob Consulta</span>
        </label>
        <Field label="Preço — “desde” (€)">
          <input
            type="number"
            name="price"
            defaultValue={property.price ?? ""}
            disabled={priceOnApplication}
            className={`${inputClass} disabled:opacity-40`}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="published" defaultChecked={property.published} />
        <span className="text-sm">Publicado — página visível no site</span>
      </label>

      <a
        href={property.campaign_path ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start text-xs tracking-[0.08em] uppercase text-accent hover:text-accent-strong transition-colors"
      >
        Ver página →
      </a>

      <button
        type="submit"
        className="self-start px-8 py-3.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong hover:-translate-y-0.5"
      >
        Guardar alterações
      </button>
    </form>
  );
}
