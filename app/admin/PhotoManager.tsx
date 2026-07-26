"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { uploadPhotos, deletePhoto, movePhoto } from "./photo-actions";
import type { PropertyPhoto } from "@/lib/property-types";

export function PhotoManager({
  propertyId,
  propertyReference,
  photos,
}: {
  propertyId: string;
  propertyReference: string;
  photos: PropertyPhoto[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUpload(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await uploadPhotos(propertyId, propertyReference, formData);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao enviar fotos.");
      }
    });
  }

  return (
    <fieldset className="flex flex-col gap-4">
      <h2 className="font-display text-lg text-accent">Fotos</h2>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((photo, idx) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden border border-border">
              <Image src={photo.storage_path} alt="" fill sizes="200px" className="object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={idx === 0 || isPending}
                    onClick={() => startTransition(() => movePhoto(photo.id, propertyId, propertyReference, -1))}
                    className="flex h-7 w-7 items-center justify-center bg-white/20 text-white text-sm disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    disabled={idx === photos.length - 1 || isPending}
                    onClick={() => startTransition(() => movePhoto(photo.id, propertyId, propertyReference, 1))}
                    className="flex h-7 w-7 items-center justify-center bg-white/20 text-white text-sm disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(() => deletePhoto(photo.id, propertyReference))}
                  className="text-[11px] tracking-[0.08em] uppercase text-white/90 hover:text-white"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form action={handleUpload} className="flex items-center gap-3">
        <input ref={fileInputRef} type="file" name="files" accept="image/*" multiple className="text-sm" />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 border border-border text-xs tracking-[0.08em] uppercase hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
        >
          {isPending ? "A enviar…" : "Enviar"}
        </button>
      </form>
      {error && <p className="text-sm" style={{ color: "#a13f3f" }}>{error}</p>}
    </fieldset>
  );
}
