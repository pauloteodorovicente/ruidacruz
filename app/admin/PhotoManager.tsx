"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  uploadPhotos,
  deletePhoto,
  movePhoto,
  reorderPhotos,
  togglePhotoVisibility,
  setCoverPhoto,
  uploadCoverPhoto,
  setGalleryFeatured,
  setGalleryVideoInGrid,
  createGalleryVideoUpload,
  addGalleryVideo,
} from "./photo-actions";
import { createClient } from "@/lib/supabase/client";
import { resolveCover } from "@/lib/cover";
import type { PropertyPhoto } from "@/lib/property-types";

// Desloca por uma "linha inteira" nas setinhas de cima/baixo — referência de
// desktop (grid de 4 colunas); no mobile (2 colunas) o efeito é pular 2
// linhas, ainda assim previsível. As setinhas de lado continuam movendo 1 a 1.
const ROW_STEP = 4;

export function PhotoManager({
  propertyId,
  propertyReference,
  photos: photosProp,
  coverPhotoId,
  legacyCover,
  hasHeroVideo,
  galleryFeatured,
  galleryVideoInGrid,
}: {
  propertyId: string;
  propertyReference: string;
  photos: PropertyPhoto[];
  // Capa definida no admin (nulo = vale a primeira foto visível).
  coverPhotoId: string | null;
  // Capa que a landing já tinha no código (fotos fixas), usada enquanto não houver capa definida.
  legacyCover: string | null;
  // O imóvel tem vídeo no Hero (pode aparecer na galeria e ser destacado).
  hasHeroVideo: boolean;
  // Mídia em destaque na galeria (2x2): id de uma foto ou "video".
  galleryFeatured: string | null;
  galleryVideoInGrid: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoStatus, setVideoStatus] = useState("");

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

  // Qual foto está valendo como capa agora (mesma regra do site público).
  const cover = resolveCover(photos, coverPhotoId);
  const explicitCoverHidden = Boolean(coverPhotoId) && cover.source !== "explicit";

  function handleSetCover(photoId: string | null) {
    setError(null);
    startTransition(async () => {
      try {
        await setCoverPhoto(propertyId, propertyReference, photoId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao definir a capa.");
      }
    });
  }

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

  function handleCoverUpload(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await uploadCoverPhoto(propertyId, propertyReference, formData);
        if (coverInputRef.current) coverInputRef.current.value = "";
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao enviar a capa.");
      }
    });
  }

  function handleFeatured(media: string | null) {
    setError(null);
    startTransition(async () => {
      try {
        await setGalleryFeatured(propertyId, propertyReference, media);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao destacar a mídia.");
      }
    });
  }

  function handleVideoInGrid(on: boolean) {
    setError(null);
    startTransition(async () => {
      try {
        await setGalleryVideoInGrid(propertyId, propertyReference, on);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao mudar a galeria.");
      }
    });
  }

  // Vídeo da galeria: vai direto do navegador ao armazenamento (link assinado) porque é grande
  // demais para passar pelo servidor; depois o servidor só registra o vídeo na galeria.
  function handleVideo(file: File | undefined) {
    if (!file) return;
    setError(null);
    setVideoStatus("A preparar o envio…");
    startTransition(async () => {
      try {
        const { path, token } = await createGalleryVideoUpload(propertyId, file.name);
        setVideoStatus("A enviar o vídeo… (pode demorar alguns minutos)");
        const { error: uploadError } = await createClient()
          .storage.from("property-photos")
          .uploadToSignedUrl(path, token, file, { contentType: file.type || "video/mp4" });
        if (uploadError) throw new Error(uploadError.message);
        await addGalleryVideo(propertyId, propertyReference, path);
        setVideoStatus("");
        if (videoInputRef.current) videoInputRef.current.value = "";
      } catch (e) {
        setVideoStatus("");
        setError(e instanceof Error ? e.message : "Falha ao enviar o vídeo.");
      }
    });
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

      <div className="flex flex-col gap-3 border border-border p-4 sm:flex-row sm:items-start" data-testid="cover-panel">
        <div className="relative h-24 w-36 shrink-0 overflow-hidden border border-border bg-background-raised">
          {cover.source === "explicit" || (cover.source === "auto" && !legacyCover) ? (
            <Image src={cover.photo!.storage_path} alt="" fill sizes="144px" className="object-cover" />
          ) : legacyCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={legacyCover} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.08em] text-foreground-muted">
              Assinatura
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 text-xs text-foreground-muted">
          <p className="text-sm text-foreground">Capa do imóvel (cards da Home e do Portfólio)</p>
          <p>
            {cover.source === "explicit" && "Capa escolhida no admin."}
            {cover.source !== "explicit" && legacyCover && "Capa padrão do site (imagem fixa desta página). Envie uma foto abaixo para trocar."}
            {cover.source === "auto" && !legacyCover && "Sem capa escolhida: vale a primeira foto visível."}
            {cover.source === "none" && !legacyCover && "Sem fotos: o card mostra a assinatura do Rui."}
          </p>
          <form action={handleCoverUpload} className="flex flex-wrap items-center gap-2">
            <input ref={coverInputRef} type="file" name="cover" accept="image/*" className="text-xs" />
            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-1.5 border border-border text-[11px] tracking-[0.08em] uppercase hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
            >
              {isPending ? "A enviar…" : "Enviar foto como capa"}
            </button>
          </form>
          {cover.source === "explicit" && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleSetCover(null)}
              className="self-start underline underline-offset-2 hover:text-accent disabled:opacity-50"
            >
              Voltar à automática
            </button>
          )}
        </div>
      </div>

      {hasHeroVideo && (
        <div className="flex flex-col gap-2 border border-border p-4 text-xs text-foreground-muted" data-testid="video-panel">
          <p className="text-sm text-foreground">Vídeo do Hero na galeria</p>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={galleryVideoInGrid || galleryFeatured === "video"}
              disabled={isPending || galleryFeatured === "video"}
              onChange={(e) => handleVideoInGrid(e.target.checked)}
            />
            Mostrar o vídeo na galeria, como primeiro quadro
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={galleryFeatured === "video"}
              disabled={isPending}
              onChange={(e) => handleFeatured(e.target.checked ? "video" : null)}
            />
            Destacar o vídeo (ocupa o espaço de 4 quadros)
          </label>
        </div>
      )}
      {photos.length > 1 && <p className="text-xs text-foreground-muted -mt-2">Arraste pra reordenar</p>}
      {photos.length > 0 && (
        <p className="text-xs text-foreground-muted -mt-2">
          {cover.source === "explicit" && (
            <>
              Capa definida: foto {photos.findIndex((photo) => photo.id === cover.photo?.id) + 1}.{" "}
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleSetCover(null)}
                className="underline underline-offset-2 hover:text-accent disabled:opacity-50"
              >
                Voltar à automática
              </button>
            </>
          )}
          {cover.source === "auto" && (
            <>Sem capa definida — vale a primeira foto visível. Passe o mouse numa foto e use “Definir capa”.</>
          )}
          {cover.source === "none" && <>Nenhuma foto visível — o card mostra a assinatura do Rui como capa.</>}
          {explicitCoverHidden && <> A capa definida está arquivada, por isso vale a primeira visível.</>}
        </p>
      )}

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
              {photo.media_type === "video" ? (
                <video src={photo.storage_path} muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <Image src={photo.storage_path} alt="" fill sizes="200px" className="object-cover" />
              )}
              {photo.media_type === "video" && (
                <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] tracking-[0.06em] uppercase px-1.5 py-0.5">
                  ▶ Vídeo
                </span>
              )}
              {!photo.visible && (
                <span className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[10px] tracking-[0.06em] uppercase px-1.5 py-0.5">
                  Arquivada
                </span>
              )}
              {photo.visible && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleFeatured(galleryFeatured === photo.id ? null : photo.id)}
                  title="A mídia destacada ocupa o espaço de 4 na galeria do site e vai para a primeira posição"
                  className={`absolute bottom-1.5 left-1.5 z-10 px-1.5 py-0.5 text-[10px] tracking-[0.06em] uppercase disabled:opacity-50 ${
                    galleryFeatured === photo.id ? "bg-accent text-background" : "bg-black/70 text-white hover:bg-black"
                  }`}
                >
                  {galleryFeatured === photo.id ? "◼ Destacada" : "◻ Destacar"}
                </button>
              )}
              {cover.photo?.id === photo.id && (
                <span className="absolute top-1.5 right-1.5 bg-accent text-background text-[10px] tracking-[0.06em] uppercase px-1.5 py-0.5">
                  {cover.source === "explicit" ? "★ Capa" : "Capa (auto)"}
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
                {photo.visible && photo.media_type !== "video" && !(cover.photo?.id === photo.id && cover.source === "explicit") && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleSetCover(photo.id)}
                    title="Usar esta foto como capa do imóvel (sem mudar a ordem da galeria)"
                    className="mt-0.5 text-[10px] tracking-[0.08em] uppercase text-white/90 hover:text-white"
                  >
                    ☆ Definir capa
                  </button>
                )}
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
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          disabled={isPending}
          onChange={(e) => handleVideo(e.target.files?.[0])}
          className="text-sm"
          aria-label="Adicionar vídeo à galeria"
        />
        <span className="text-xs text-foreground-muted">
          {videoStatus || "Adicionar vídeo à galeria (MP4 ou WebM). Ele entra como uma mídia como as fotos: dá para reordenar, arquivar e destacar."}
        </span>
      </div>
      {error && <p className="text-sm" style={{ color: "#a13f3f" }}>{error}</p>}
    </fieldset>
  );
}
