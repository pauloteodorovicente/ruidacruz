"use client";

import { useMemo, useState } from "react";
import { saveProperty } from "./actions";
import { recommendLayoutMode, type Property } from "@/lib/property-types";
import { Select } from "@/app/components/Select";
import { PreviewLinkButton } from "./PreviewLinkButton";
import { ColorThemePicker } from "./ColorThemePicker";
import { AiDescriptionAssist } from "./AiDescriptionAssist";

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
  const [businessType, setBusinessType] = useState(property?.business_type ?? "venda");
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
            <Select
              name="property_type"
              value={propertyType}
              onChange={(v) => setPropertyType(v as typeof propertyType)}
              options={[
                { value: "moradia", label: "Moradia" },
                { value: "apartamento", label: "Apartamento" },
                { value: "terreno", label: "Terreno" },
                { value: "outro", label: "Outro" },
              ]}
            />
          </Field>
          <Field label="Tipologia">
            <input name="typology" defaultValue={property?.typology ?? ""} placeholder="T5" className={inputClass} />
          </Field>
          <Field label="Negócio">
            <Select
              name="business_type"
              value={businessType}
              onChange={(v) => setBusinessType(v as typeof businessType)}
              options={[
                { value: "venda", label: "Venda" },
                { value: "arrendamento", label: "Arrendamento" },
              ]}
            />
          </Field>
          <Field label="Status">
            <Select
              name="status"
              defaultValue={property?.status ?? "disponivel"}
              options={[
                { value: "disponivel", label: "Disponível" },
                { value: "reservado", label: "Reservado" },
                { value: "vendido", label: "Vendido" },
                { value: "off_market", label: "Off-Market" },
              ]}
            />
            <p className="text-xs text-foreground-muted mt-1.5">
              Off-Market: some da busca pública — quem tentar aceder ao link vê um teaser com pedido de acesso, não
              a ficha completa. Libera manualmente gerando um link de pré-visualização e enviando direto.
            </p>
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
          <div className="flex flex-col gap-3">
            <a
              href={`/imoveis/${property.reference}`}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start text-xs tracking-[0.08em] uppercase text-accent hover:text-accent-strong transition-colors"
            >
              Pré-visualizar →
            </a>
            {!property.is_campaign_page && (
              <PreviewLinkButton propertyId={property.id} propertyReference={property.reference} />
            )}
          </div>
        )}
      </fieldset>

      {!property?.is_campaign_page && (
        <fieldset className="flex flex-col gap-4">
          <h2 className="font-display text-lg text-accent">Aparência</h2>
          <div>
            <span className={labelClass}>Paleta de cor</span>
            <p className="text-xs text-foreground-muted mb-2">
              Muda a cor de destaque só nesta ficha de imóvel — o resto do site nunca muda.
            </p>
            <ColorThemePicker defaultValue={property?.color_theme} />
          </div>
        </fieldset>
      )}

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
          <Field label={businessType === "arrendamento" ? "Renda mensal (€)" : "Preço (€)"}>
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
            <Select
              name="energy_certificate"
              defaultValue={property?.energy_certificate ?? ""}
              placeholder="— Ainda não disponível —"
              options={[
                { value: "", label: "— Ainda não disponível —" },
                ...["A+", "A", "B", "B-", "C", "D", "E", "F"].map((c) => ({ value: c, label: c })),
              ]}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <h2 className="font-display text-lg text-accent">Conteúdo</h2>
        <Field label="Descrição">
          <textarea name="description" defaultValue={property?.description ?? ""} rows={5} className={inputClass} />
        </Field>
        <AiDescriptionAssist />
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
          <Select
            name="layout_mode"
            value={effectiveLayoutMode}
            onChange={setLayoutMode}
            options={Object.entries(LAYOUT_LABEL).map(([value, label]) => ({
              value,
              label: `${label}${value === recommended ? " (recomendado)" : ""}`,
            }))}
          />
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
