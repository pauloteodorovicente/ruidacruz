"use client";

import { useRef, useTransition } from "react";
import Image from "next/image";
import { saveTypology, deleteTypology, uploadTypologyFloorplan, deleteTypologyFloorplan } from "./typology-actions";
import type { PropertyTypology, TypologyFloorplan } from "@/lib/property-typologies";

const inputClass =
  "w-full bg-transparent border border-border px-3 py-2 text-sm placeholder:text-foreground-muted focus:border-accent outline-none transition-colors";
const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1";

type Ctx = { propertyId: string; propertyReference: string; campaignPath: string | null };

function HiddenCtxFields({ ctx }: { ctx: Ctx }) {
  return (
    <>
      <input type="hidden" name="property_id" value={ctx.propertyId} />
      <input type="hidden" name="property_reference" value={ctx.propertyReference} />
      <input type="hidden" name="campaign_path" value={ctx.campaignPath ?? ""} />
    </>
  );
}

function TypologyCard({ typology, floorplans, ctx }: { typology: PropertyTypology; floorplans: TypologyFloorplan[]; ctx: Ctx }) {
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUpload(formData: FormData) {
    startTransition(() => uploadTypologyFloorplan(typology.id, ctx.propertyReference, ctx.campaignPath, formData));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="border border-border p-4 flex flex-col gap-3">
      <form action={saveTypology} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1.4fr_140px]">
        <input type="hidden" name="id" value={typology.id} />
        <HiddenCtxFields ctx={ctx} />
        <label className="block">
          <span className={labelClass}>Nome (ex.: T2A)</span>
          <input name="name" defaultValue={typology.name} required className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Descrição</span>
          <input name="description" defaultValue={typology.description ?? ""} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Preço a partir de (€)</span>
          <input name="price_from" type="number" defaultValue={typology.price_from ?? ""} className={inputClass} />
        </label>
        <div className="sm:col-span-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => startTransition(() => deleteTypology(typology.id, ctx.propertyReference, ctx.campaignPath))}
            disabled={isPending}
            className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors disabled:opacity-50"
          >
            Remover tipologia
          </button>
          <button type="submit" className="text-xs tracking-[0.08em] uppercase text-accent hover:text-accent-strong transition-colors">
            Guardar
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        {floorplans.map((f) => (
          <div key={f.id} className="group relative h-16 w-16 overflow-hidden border border-border">
            <Image src={f.storage_path} alt="" fill sizes="64px" className="object-cover" />
            <button
              type="button"
              onClick={() => startTransition(() => deleteTypologyFloorplan(f.id, ctx.propertyReference, ctx.campaignPath))}
              className="absolute inset-0 flex items-center justify-center bg-black/60 text-[9px] uppercase text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              Remover
            </button>
          </div>
        ))}
        <form action={handleUpload} className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" name="file" accept="image/*" className="text-xs" />
          <button
            type="submit"
            disabled={isPending}
            className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors disabled:opacity-50"
          >
            + Planta
          </button>
        </form>
      </div>
    </div>
  );
}

// Cada tipologia é um "tipo de fração" (ex. T2A) com nome/descrição/preço a
// partir de + plantas próprias — não confundir com property_units (a lista
// de frações/unidades individuais de verdade, ver UnitsManager.tsx). Nem
// todo empreendimento precisa das duas coisas: o One Green Way só usa
// tipologias (2 grupos amplos); o Verdelago usa as duas (tipologias +
// as 58 frações reais, cada uma associada a uma tipologia).
export function TypologyManager({
  typologies,
  floorplans,
  ...ctx
}: Ctx & { typologies: PropertyTypology[]; floorplans: TypologyFloorplan[] }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <h2 className="font-display text-lg text-accent">Tipologias</h2>
      <div className="flex flex-col gap-4">
        {typologies.map((t) => (
          <TypologyCard key={t.id} typology={t} floorplans={floorplans.filter((f) => f.typology_id === t.id)} ctx={ctx} />
        ))}
      </div>
      <form
        action={saveTypology}
        className="grid grid-cols-1 gap-3 border border-dashed border-border p-4 sm:grid-cols-[1fr_1.4fr_140px]"
      >
        <HiddenCtxFields ctx={ctx} />
        <label className="block">
          <span className={labelClass}>Nome (ex.: T2A)</span>
          <input name="name" required className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Descrição</span>
          <input name="description" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Preço a partir de (€)</span>
          <input name="price_from" type="number" className={inputClass} />
        </label>
        <div className="sm:col-span-3">
          <button type="submit" className="text-xs tracking-[0.08em] uppercase text-accent hover:text-accent-strong transition-colors">
            + Nova Tipologia
          </button>
        </div>
      </form>
    </fieldset>
  );
}
