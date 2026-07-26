"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { uploadFloorplan, deleteFloorplan } from "./floorplan-actions";
import type { PropertyFloorplan } from "@/lib/property-types";

export function FloorplanManager({
  propertyId,
  propertyReference,
  floorplans,
}: {
  propertyId: string;
  propertyReference: string;
  floorplans: PropertyFloorplan[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const labelInputRef = useRef<HTMLInputElement>(null);

  function handleUpload(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await uploadFloorplan(propertyId, propertyReference, formData);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (labelInputRef.current) labelInputRef.current.value = "";
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao enviar planta.");
      }
    });
  }

  return (
    <fieldset className="flex flex-col gap-4">
      <h2 className="font-display text-lg text-accent">Plantas</h2>

      {floorplans.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {floorplans.map((plan) => (
            <div key={plan.id} className="group relative aspect-square overflow-hidden border border-border bg-[#f4f2ee]">
              <Image src={plan.storage_path} alt={plan.floor_label} fill sizes="200px" className="object-contain" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-white text-xs">{plan.floor_label}</p>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(() => deleteFloorplan(plan.id, propertyReference))}
                  className="text-[11px] tracking-[0.08em] uppercase text-white/90 hover:text-white"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form action={handleUpload} className="flex flex-wrap items-center gap-3">
        <input ref={labelInputRef} name="floor_label" placeholder="Ex.: Rés-do-Chão" required className="bg-transparent border border-border px-3 py-2 text-sm" />
        <input ref={fileInputRef} type="file" name="file" accept="image/*" required className="text-sm" />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 border border-border text-xs tracking-[0.08em] uppercase hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
        >
          {isPending ? "A enviar…" : "Adicionar"}
        </button>
      </form>
      {error && <p className="text-sm" style={{ color: "#a13f3f" }}>{error}</p>}
    </fieldset>
  );
}
