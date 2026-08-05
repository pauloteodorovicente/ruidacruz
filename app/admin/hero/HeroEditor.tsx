"use client";

import { useState, useTransition } from "react";
import { itemCountForLayout, type HeroItem, type HeroLayout, type HeroMediaType, type HomeHero } from "@/lib/home-hero-types";
import type { GalleryPhoto } from "@/lib/admin-gallery";
import { MediaPickerModal } from "./MediaPickerModal";
import { PositionZoomEditor } from "./PositionZoomEditor";

const LAYOUTS: { value: HeroLayout; label: string }[] = [
  { value: "single", label: "1 mídia" },
  { value: "duo", label: "2 fotos" },
  { value: "trio", label: "3 fotos" },
  { value: "quad", label: "4 fotos" },
  { value: "penta", label: "5 fotos" },
];

function emptyItem(kind: "image" | "video", src: string): HeroItem {
  return { src, kind, position_x: 50, position_y: 50, zoom: 1 };
}

// onSave: quem usa o editor decide onde salvar (Home = singleton, imóvel =
// por property_id) — o editor em si não sabe de onde vem nem pra onde vai.
export function HeroEditor({
  initial,
  galleryPhotos,
  onSave,
}: {
  initial: HomeHero | null;
  galleryPhotos: GalleryPhoto[];
  onSave: (mediaType: HeroMediaType, layout: HeroLayout, items: HeroItem[]) => Promise<void>;
}) {
  const [mediaType, setMediaType] = useState<HeroMediaType>(initial?.media_type ?? "video");
  const [layout, setLayout] = useState<HeroLayout>(initial?.layout ?? "single");
  const [items, setItems] = useState<HeroItem[]>(initial?.items ?? []);
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slotCount = mediaType === "video" ? 1 : itemCountForLayout(layout);

  function switchMediaType(next: HeroMediaType) {
    setMediaType(next);
    setLayout(next === "video" ? "single" : layout === "single" ? "duo" : layout);
    setItems([]);
    setSaved(false);
  }

  function switchLayout(next: HeroLayout) {
    setLayout(next);
    setItems((prev) => prev.slice(0, itemCountForLayout(next)));
    setSaved(false);
  }

  function selectMedia(src: string) {
    if (pickerSlot === null) return;
    const kind = mediaType === "video" ? "video" : "image";
    setItems((prev) => {
      const next = [...prev];
      next[pickerSlot] = emptyItem(kind, src);
      return next;
    });
    setPickerSlot(null);
    setSaved(false);
  }

  function updateItem(index: number, next: HeroItem) {
    setItems((prev) => prev.map((it, i) => (i === index ? next : it)));
    setSaved(false);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  }

  function handleDrop(toIndex: number) {
    if (dragFrom === null || dragFrom === toIndex) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragFrom, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDragFrom(null);
    setSaved(false);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await onSave(mediaType, layout, items);
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao salvar.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        {(["video", "image"] as const).map((type) => (
          <button
            key={type}
            onClick={() => switchMediaType(type)}
            className={`px-5 py-2.5 text-xs tracking-[0.08em] uppercase border transition-colors ${
              mediaType === type ? "border-accent text-accent" : "border-border text-foreground-muted hover:border-accent/50"
            }`}
          >
            {type === "video" ? "Vídeo único" : "Foto(s)"}
          </button>
        ))}
      </div>

      {mediaType === "image" && (
        <div className="flex flex-wrap gap-2">
          {LAYOUTS.filter((l) => l.value !== "single" || mediaType === "image").map((l) => (
            <button
              key={l.value}
              onClick={() => switchLayout(l.value)}
              className={`px-4 py-2 text-xs tracking-[0.05em] border transition-colors ${
                layout === l.value ? "border-accent text-accent" : "border-border text-foreground-muted hover:border-accent/50"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}

      <div className={`grid gap-4 ${slotCount === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        {Array.from({ length: slotCount }).map((_, index) => {
          const item = items[index];
          return (
            <div
              key={index}
              draggable={!!item}
              onDragStart={() => setDragFrom(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              className="flex flex-col gap-2"
            >
              {item ? (
                <>
                  <PositionZoomEditor item={item} onChange={(next) => updateItem(index, next)} />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground-muted">
                      {slotCount > 1 ? `Posição ${index + 1} · arraste pra reordenar` : "Arraste na prévia pra reposicionar"}
                    </span>
                    <div className="flex gap-3">
                      <button onClick={() => setPickerSlot(index)} className="text-accent hover:text-accent-strong">
                        Trocar
                      </button>
                      <button onClick={() => removeItem(index)} className="text-foreground-muted hover:text-foreground">
                        Remover
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setPickerSlot(index)}
                  className="flex aspect-video w-full items-center justify-center border border-dashed border-border text-sm text-foreground-muted hover:border-accent hover:text-accent transition-colors"
                >
                  + Escolher {mediaType === "video" ? "vídeo" : "foto"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isPending || items.length === 0}
          className="px-6 py-3 bg-accent text-background text-xs tracking-[0.08em] uppercase hover:bg-accent-strong transition-colors disabled:opacity-50"
        >
          {isPending ? "A salvar…" : "Salvar Hero"}
        </button>
        {saved && !isPending && <span className="text-xs text-accent">Salvo — já está no ar.</span>}
        {error && <span className="text-xs" style={{ color: "#a13f3f" }}>{error}</span>}
      </div>

      {pickerSlot !== null && (
        <MediaPickerModal
          mediaType={mediaType === "video" ? "video" : "image"}
          galleryPhotos={galleryPhotos}
          onSelect={selectMedia}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </div>
  );
}
