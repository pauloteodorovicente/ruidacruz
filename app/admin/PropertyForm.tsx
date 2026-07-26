"use client";

import { useMemo, useState } from "react";
import { saveProperty } from "./actions";
import { recommendLayoutMode, type Property } from "@/lib/property-types";

const LAYOUT_LABEL: Record<string, string> = {
  arquitetura: "Arquitetura",
  paisagem_terreno: "Paisagem / Terreno",
  urbano: "Urbano",
};

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

// Formulário único, usado tanto pra criar quanto editar (property presente =
// edição). Tema/layout: recomendo automaticamente a partir do tipo/arquiteto
// digitados, mas o campo fica sempre editável — o Rui pode sobrescrever.
export function PropertyForm({ property }: { property?: Property }) {
  const [propertyType, setPropertyType] = useState(property?.property_type ?? "moradia");
  const [architect, setArchitect] = useState(property?.architect ?? "");
  const [layoutMode, setLayoutMode] = useState(property?.layout_mode ?? "");
  const [priceOnApplication, setPriceOnApplication] = useState(property?.price_on_application ?? false);

  const recommended = useMemo(
    () => recommendLayoutMode({ property_type: propertyType, architect: architect || null }),
    [propertyType, architect]
  );
  const effectiveLayoutMode = layoutMode || recommended;

  return (
    <form action={saveProperty} className="flex flex-col gap-10">
      {property && <input type="hidden" name="id" value={property.id} />}

      <fieldset className="flex flex-col gap-4">
        <h2 className="font-display text-lg text-accent">Identificação</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Referência">
            <input name="reference" defaultValue={property?.reference} required className={inputClass} />
          </Field>
          <Field label="Título">
            <input name="title" defaultValue={property?.title} required className={inputClass} />
          </Field>
          <Field label="Tipo">
            <select
              name="property_type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as typeof propertyType)}
              className={inputClass}
            >
              <option value="moradia">Moradia</option>
              <option value="apartamento">Apartamento</option>
              <option value="terreno">Terreno</option>
              <option value="outro">Outro</option>
            </select>
          </Field>
          <Field label="Tipologia">
            <input name="typology" defaultValue={property?.typology ?? ""} placeholder="T5" className={inputClass} />
          </Field>
          <Field label="Status">
            <select name="status" defaultValue={property?.status ?? "disponivel"} className={inputClass}>
              <option value="disponivel">Disponível</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
              <option value="off_market">Off-Market</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 self-end pb-2.5">
            <input type="checkbox" name="featured" defaultChecked={property?.featured} />
            <span className="text-sm">Destaque na home</span>
          </label>
          <label className="flex items-center gap-2 self-end pb-2.5">
            <input type="checkbox" name="published" defaultChecked={property?.published ?? false} />
            <span className="text-sm">Publicado (visível no site)</span>
          </label>
        </div>
        {property && (
          <a
            href={`/imoveis/${property.reference}`}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start text-xs tracking-[0.08em] uppercase text-accent hover:text-accent-strong transition-colors"
          >
            Pré-visualizar →
          </a>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <h2 className="font-display text-lg text-accent">Localização</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Zona">
            <input name="zone" defaultValue={property?.zone ?? ""} className={inputClass} />
          </Field>
          <Field label="Concelho">
            <input name="municipality" defaultValue={property?.municipality ?? ""} className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Link do Google Maps">
              <input name="map_url" defaultValue={property?.map_url ?? ""} className={inputClass} />
            </Field>
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <h2 className="font-display text-lg text-accent">Números</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={priceOnApplication}
              onChange={(e) => setPriceOnApplication(e.target.checked)}
              name="price_on_application"
            />
            <span className="text-sm">Preço Sob Consulta</span>
          </label>
          <Field label="Preço (€)">
            <input
              type="number"
              name="price"
              defaultValue={property?.price ?? ""}
              disabled={priceOnApplication}
              className={`${inputClass} disabled:opacity-40`}
            />
          </Field>
          <Field label="Terreno (m²)">
            <input type="number" name="land_area_sqm" defaultValue={property?.land_area_sqm ?? ""} className={inputClass} />
          </Field>
          <Field label="Construção (m²)">
            <input
              type="number"
              name="construction_area_sqm"
              defaultValue={property?.construction_area_sqm ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Garagem">
            <input name="parking" defaultValue={property?.parking ?? ""} className={inputClass} />
          </Field>
          <Field label="Ano de construção">
            <input type="number" name="construction_year" defaultValue={property?.construction_year ?? ""} className={inputClass} />
          </Field>
          <Field label="Certificado energético">
            <select name="energy_certificate" defaultValue={property?.energy_certificate ?? ""} className={inputClass}>
              <option value="">— Ainda não disponível —</option>
              {["A+", "A", "B", "B-", "C", "D", "E", "F"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <h2 className="font-display text-lg text-accent">Conteúdo</h2>
        <Field label="Descrição">
          <textarea name="description" defaultValue={property?.description ?? ""} rows={5} className={inputClass} />
        </Field>
        <Field label={'"Em Detalhe" — uma linha por item'}>
          <textarea
            name="highlights"
            defaultValue={property?.highlights?.join("\n") ?? ""}
            rows={6}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Arquiteto (opcional)">
            <input name="architect" value={architect} onChange={(e) => setArchitect(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Paisagista (opcional)">
            <input name="landscaper" defaultValue={property?.landscaper ?? ""} className={inputClass} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <h2 className="font-display text-lg text-accent">Configuração</h2>
        <Field label={`Tema/layout — recomendado: ${LAYOUT_LABEL[recommended]}`}>
          <select
            name="layout_mode"
            value={effectiveLayoutMode}
            onChange={(e) => setLayoutMode(e.target.value)}
            className={inputClass}
          >
            {Object.entries(LAYOUT_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}{value === recommended ? " (recomendado)" : ""}
              </option>
            ))}
          </select>
        </Field>
      </fieldset>

      <button
        type="submit"
        className="self-start px-8 py-3.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong hover:-translate-y-0.5"
      >
        {property ? "Guardar alterações" : "Criar imóvel"}
      </button>
    </form>
  );
}
