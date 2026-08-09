"use client";

import { useTransition } from "react";
import { saveUnit, deleteUnit } from "./typology-actions";
import type { PropertyTypology, PropertyUnit } from "@/lib/property-typologies";

const cellInputClass =
  "w-full bg-transparent border border-border px-2 py-1.5 text-xs focus:border-accent outline-none transition-colors";

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

function UnitRow({ unit, typologies, ctx }: { unit: PropertyUnit; typologies: PropertyTypology[]; ctx: Ctx }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={saveUnit}
      className="grid grid-cols-[90px_80px_80px_110px_110px_auto] items-center gap-2 border-t border-border py-2"
    >
      <input type="hidden" name="id" value={unit.id} />
      <HiddenCtxFields ctx={ctx} />
      <input name="phase_label" defaultValue={unit.phase_label ?? ""} placeholder="Fase" className={cellInputClass} />
      <input name="lot" defaultValue={unit.lot ?? ""} placeholder="Lote" className={cellInputClass} />
      <input name="fraction" defaultValue={unit.fraction ?? ""} placeholder="Fração" className={cellInputClass} />
      <select name="typology_id" defaultValue={unit.typology_id ?? ""} className={cellInputClass}>
        <option value="">— sem tipologia —</option>
        {typologies.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <input
        name="price"
        type="number"
        defaultValue={unit.price ?? ""}
        placeholder="Preço (vazio = a confirmar)"
        className={cellInputClass}
      />
      <div className="flex justify-end gap-3">
        <button type="submit" className="text-[10px] tracking-[0.06em] uppercase text-accent hover:text-accent-strong transition-colors">
          Guardar
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => deleteUnit(unit.id, ctx.propertyReference, ctx.campaignPath))}
          className="text-[10px] tracking-[0.06em] uppercase text-foreground-muted hover:text-accent transition-colors disabled:opacity-50"
        >
          Remover
        </button>
      </div>
    </form>
  );
}

// Frações/unidades individuais de verdade (lote+fração+preço), como a
// planilha real do Verdelago — opcional, um empreendimento pode ter só
// tipologias sem nenhuma unidade granular (ver TypologyManager.tsx). Preço
// vazio = "a confirmar", igual ao comportamento antigo do arquivo fixo
// lib/verdelago-units.ts (valor: null).
export function UnitsManager({
  units,
  typologies,
  ...ctx
}: Ctx & { units: PropertyUnit[]; typologies: PropertyTypology[] }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <h2 className="font-display text-lg text-accent">Unidades / Frações</h2>
      <p className="text-xs text-foreground-muted -mt-2">
        {units.length} {units.length === 1 ? "unidade" : "unidades"} cadastradas.
      </p>

      {units.length > 0 && (
        <div className="overflow-x-auto">
          <div className="grid min-w-[640px] grid-cols-[90px_80px_80px_110px_110px_auto] gap-2 text-[10px] tracking-[0.06em] uppercase text-foreground-muted">
            <span>Fase</span>
            <span>Lote</span>
            <span>Fração</span>
            <span>Tipologia</span>
            <span>Preço</span>
            <span />
          </div>
          <div className="min-w-[640px]">
            {units.map((unit) => (
              <UnitRow key={unit.id} unit={unit} typologies={typologies} ctx={ctx} />
            ))}
          </div>
        </div>
      )}

      <form
        action={saveUnit}
        className="grid grid-cols-[90px_80px_80px_110px_110px_auto] items-center gap-2 border border-dashed border-border p-3"
      >
        <HiddenCtxFields ctx={ctx} />
        <input name="phase_label" placeholder="Fase" className={cellInputClass} />
        <input name="lot" placeholder="Lote" className={cellInputClass} />
        <input name="fraction" placeholder="Fração" className={cellInputClass} />
        <select name="typology_id" defaultValue="" className={cellInputClass}>
          <option value="">— sem tipologia —</option>
          {typologies.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <input name="price" type="number" placeholder="Preço" className={cellInputClass} />
        <div className="flex justify-end">
          <button type="submit" className="text-[10px] tracking-[0.06em] uppercase text-accent hover:text-accent-strong transition-colors">
            + Unidade
          </button>
        </div>
      </form>
    </fieldset>
  );
}
