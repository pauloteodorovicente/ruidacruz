"use client";

import { useState } from "react";
import type { GalleryPhoto } from "@/lib/admin-gallery";
import { uploadHeroMedia } from "../hero-actions";

type Tab = "galeria" | "upload" | "url";

export function MediaPickerModal({
  mediaType,
  galleryPhotos,
  onSelect,
  onClose,
}: {
  mediaType: "image" | "video";
  galleryPhotos: GalleryPhoto[];
  onSelect: (src: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>(mediaType === "image" ? "galeria" : "upload");
  const [uploading, setUploading] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const publicUrl = await uploadHeroMedia(formData);
      onSelect(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar o arquivo.");
    } finally {
      setUploading(false);
    }
  }

  function handleUrlConfirm() {
    if (!urlValue.trim()) return;
    onSelect(urlValue.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-background border border-border p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg">Escolher {mediaType === "image" ? "foto" : "vídeo"}</h3>
          <button onClick={onClose} className="text-foreground-muted hover:text-foreground text-xl leading-none">
            ×
          </button>
        </div>

        <div className="flex gap-4 mb-5 border-b border-border">
          {mediaType === "image" && (
            <TabButton active={tab === "galeria"} onClick={() => setTab("galeria")}>
              Galeria
            </TabButton>
          )}
          <TabButton active={tab === "upload"} onClick={() => setTab("upload")}>
            Enviar do computador
          </TabButton>
          <TabButton active={tab === "url"} onClick={() => setTab("url")}>
            Colar URL
          </TabButton>
        </div>

        {tab === "galeria" && mediaType === "image" && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {galleryPhotos.length === 0 && (
              <p className="col-span-full text-sm text-foreground-muted">Nenhuma foto de imóvel ainda.</p>
            )}
            {galleryPhotos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => onSelect(photo.storage_path)}
                className="group relative aspect-square overflow-hidden border border-border hover:border-accent transition-colors"
                title={`${photo.property_title} — ${photo.property_reference}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.storage_path} alt="" className="h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-black/70 px-1.5 py-1 text-[10px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.property_title}
                </span>
              </button>
            ))}
          </div>
        )}

        {tab === "upload" && (
          <div className="flex flex-col gap-3">
            <input
              type="file"
              accept={mediaType === "image" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              disabled={uploading}
              className="text-sm"
            />
            {uploading && <p className="text-sm text-foreground-muted">A enviar…</p>}
            {error && <p className="text-sm" style={{ color: "#a13f3f" }}>{error}</p>}
          </div>
        )}

        {tab === "url" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-foreground-muted">
              Link direto para um arquivo de {mediaType === "image" ? "imagem (.jpg, .png, .webp...)" : "vídeo (.mp4...)"} —
              não aceita links do YouTube/Vimeo.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://…"
                className="flex-1 bg-transparent border border-border px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <button
                onClick={handleUrlConfirm}
                className="px-4 py-2 border border-border text-xs tracking-[0.08em] uppercase hover:border-accent hover:text-accent transition-colors"
              >
                Usar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 text-xs tracking-[0.08em] uppercase border-b-2 transition-colors ${
        active ? "border-accent text-accent" : "border-transparent text-foreground-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
