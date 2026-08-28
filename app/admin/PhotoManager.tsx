"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { uploadPhotos, deletePhoto, movePhoto, reorderPhotos, togglePhotoVisibility } from "./photo-actions";
import type { PropertyPhoto } from "@/lib/property-types";

// Desloca por uma "linha inteira" nas setinhas de cima/baixo — referência de
// desktop (grid de 4 colunas); no mobile (2 colunas) o efeito é pular 2
// linhas, ainda assim previsível. As setinhas de lado continuam movendo 1 a 1.
const ROW_STEP = 4;

export function PhotoManager({
  propertyId,
  propertyReference,
  photos: photosProp,
}: {
  propertyId: string;
  propertyReference: string;
  photos: PropertyPhoto[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Espelho local pra reordenar arrastando com resposta imediata na tela —
  // sincroniza de novo sempre que o servidor manda uma lista nova (upload,
  // remoção, ou o resultado já salvo do próprio arrastar). Ajuste durante o
  // render (não num efeito) — é o jeito recomendado pra "resetar estado
  // quando uma prop muda", sem o round-trip extra de um useEffect.
  const [photos, setPhotos] = useState(photosProp);
  const [syncedProp, setSyncedProp] = useState(photosProp);
  if (photosProp !== syncedProp) {
    setSyncedProp(photosProp);
    setPhotos(photosProp);
  }
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  // Reordena de verdade (no estado local) já durante o arrastar, não só ao
  // soltar — pedido do Paulo (24/08): "conforme movo, todas vão se
  // recolocando". O grid tem transition-transform (ver className abaixo),
  // então o React só precisa mover o nó pra posição nova que o navegador
  // anima a troca sozinho.
  function handleDragEnter(overIndex: number) {
    if (dragFrom === null || dragFrom === overIndex) return;
    setPhotos((current) => {
      const next = [...current];
      const [moved] = next.splice(dragFrom, 1);
      next.splice(overIndex, 0, moved);
      return next;
    });
    setDragFrom(overIndex);
  }

  function handleDrop() {
    setDragFrom(null);
    startTransition(() => reorderPhotos(propertyId, propertyReference, photos.map((p) => p.id)));
  }

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
      {photos.length > 1 && <p className="text-xs text-foreground-muted -mt-2">Arraste pra reordenar</p>}

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              draggable
              onDragStart={() => setDragFrom(idx)}
              onDragEnter={() => handleDragEnter(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onDragEnd={() => setDragFrom(null)}
              className={`group relative aspect-square overflow-hidden border cursor-grab active:cursor-grabbing transition-transform duration-200 ${
                photo.visible ? "border-border" : "border-border opacity-40"
              }`}
            >
              <Image src={photo.storage_path} alt="" fill sizes="200px" className="object-cover" />
              {!photo.visible && (
                <span className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[10px] tracking-[0.06em] uppercase px-1.5 py-0.5">
                  Arquivada
                </span>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={idx < ROW_STEP || isPending}
                    onClick={() => startTransition(() => movePhoto(photo.id, propertyId, propertyReference, -ROW_STEP))}
                    title="Mover pra cima"
                    className="flex h-6 w-6 items-center justify-center bg-white/20 text-white text-xs disabled:opacity-30"
                  >
                    ↑
                  </button>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={idx === 0 || isPending}
                    onClick={() => startTransition(() => movePhoto(photo.id, propertyId, propertyReference, -1))}
                    title="Mover pra esquerda"
                    className="flex h-7 w-7 items-center justify-center bg-white/20 text-white text-sm disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(() => togglePhotoVisibility(photo.id, propertyReference, !photo.visible))
                    }
                    title={photo.visible ? "Arquivar (esconder sem apagar)" : "Publicar de novo"}
                    className="flex h-7 w-7 items-center justify-center bg-white/20 text-white text-sm disabled:opacity-30"
                  >
                    {photo.visible ? "◎" : "◌"}
                  </button>
                  <button
                    type="button"
                    disabled={idx === photos.length - 1 || isPending}
                    onClick={() => startTransition(() => movePhoto(photo.id, propertyId, propertyReference, 1))}
                    title="Mover pra direita"
                    className="flex h-7 w-7 items-center justify-center bg-white/20 text-white text-sm disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={idx + ROW_STEP >= photos.length || isPending}
                    onClick={() => startTransition(() => movePhoto(photo.id, propertyId, propertyReference, ROW_STEP))}
                    title="Mover pra baixo"
                    className="flex h-6 w-6 items-center justify-center bg-white/20 text-white text-xs disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(() => deletePhoto(photo.id, propertyReference))}
                  className="mt-1 text-[10px] tracking-[0.08em] uppercase text-white/90 hover:text-white"
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
