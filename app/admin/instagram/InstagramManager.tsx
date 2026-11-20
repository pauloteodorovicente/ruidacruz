"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  addInstagramPost,
  createInstagramUpload,
  deleteInstagramPost,
  reorderInstagramPosts,
  saveInstagramSettings,
  setInstagramPostVisible,
  updateInstagramPost,
} from "../instagram-actions";
import { INSTAGRAM_LIMITS, normalizeInstagramPostUrl } from "@/lib/instagram";
import type { InstagramLayout, InstagramPost, InstagramSettings } from "@/lib/instagram";

const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1.5";
const inputClass =
  "w-full bg-transparent border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/60 focus:border-accent outline-none transition-colors";
const primaryButton =
  "px-6 py-2.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong disabled:opacity-50";
const smallButton =
  "text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors disabled:opacity-40";

const MAX_IMAGE_SIDE = 1080;

// Reduz a imagem no próprio navegador antes de enviar (lado maior de 1080 px, JPEG): fica leve para o
// site e nunca estoura o armazenamento. Mantém a proporção; o recorte quadrado é feito na exibição.
async function shrinkImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("O navegador não conseguiu preparar a imagem.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob) throw new Error("Não consegui preparar a imagem. Tente outra foto.");
  return blob;
}

const LAYOUTS: { value: InstagramLayout; title: string; hint: string }[] = [
  { value: "phone", title: "Celular animado", hint: "Texto ao lado de um celular que gira devagar enquanto os posts descem, ligado à rolagem da página. Fica melhor com 8 a 12 posts." },
  { value: "grid", title: "Galeria fixa", hint: "Quadrados lado a lado, 4 por linha (2 no celular). Fica melhor com 4, 8 ou 12 posts." },
  { value: "carousel", title: "Carrossel infinito", hint: "Uma fita que anda sozinha, devagar, e pausa quando o mouse passa por cima. Aceita qualquer quantidade." },
];

export function InstagramManager({
  initialSettings,
  initialPosts,
}: {
  initialSettings: InstagramSettings;
  initialPosts: InstagramPost[];
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [baseline, setBaseline] = useState(initialSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [savingSettings, startSaveSettings] = useTransition();

  const [posts, setPosts] = useState(initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [busy, startBusy] = useTransition();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [postUrl, setPostUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [adding, setAdding] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ postUrl: "", caption: "", isVideo: false });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const settingsUnchanged =
    settings.enabled === baseline.enabled && settings.layout === baseline.layout && settings.maxPosts === baseline.maxPosts;

  // Os primeiros N posts visíveis, na ordem desta lista, são os que aparecem na Home.
  const visibleIds = posts.filter((p) => p.visible).map((p) => p.id);
  const shownIds = new Set(visibleIds.slice(0, settings.maxPosts));

  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSettingsError(null);
    setSettingsSaved(false);
    startSaveSettings(async () => {
      try {
        const result = await saveInstagramSettings(settings);
        setSettings(result.settings);
        setBaseline(result.settings);
        setSettingsSaved(true);
      } catch (err) {
        setSettingsError(err instanceof Error ? err.message : "Falha ao guardar.");
      }
    });
  }

  function pickFile(next: File | undefined) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setError(null);
    if (!next) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    if (!next.type.startsWith("image/")) {
      setError("Escolha uma imagem (JPG, PNG ou WebP).");
      return;
    }
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) return setError("Escolha a imagem do post.");
    if (!normalizeInstagramPostUrl(postUrl)) {
      return setError("Link inválido. Cole o endereço de uma publicação ou reel do Instagram (instagram.com/p/… ou instagram.com/reel/…).");
    }
    setAdding(true);
    try {
      const small = await shrinkImage(file);
      const { path, token } = await createInstagramUpload();
      const { error: uploadError } = await createClient()
        .storage.from("property-photos")
        .uploadToSignedUrl(path, token, small, { contentType: "image/jpeg" });
      if (uploadError) throw new Error(uploadError.message);
      const created = await addInstagramPost({ path, postUrl, caption });
      setPosts((prev) => [...prev, created]);
      setPostUrl("");
      setCaption("");
      pickFile(undefined);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao adicionar o post.");
    } finally {
      setAdding(false);
    }
  }

  function applyOrder(next: InstagramPost[]) {
    setPosts(next);
    startBusy(async () => {
      try {
        await reorderInstagramPosts(next.map((p) => p.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao reordenar.");
      }
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= posts.length) return;
    const next = [...posts];
    [next[index], next[target]] = [next[target], next[index]];
    applyOrder(next);
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return setDragIndex(null);
    const next = [...posts];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setDragIndex(null);
    applyOrder(next);
  }

  function toggleVisible(post: InstagramPost) {
    setError(null);
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, visible: !p.visible } : p)));
    startBusy(async () => {
      try {
        await setInstagramPostVisible(post.id, !post.visible);
      } catch (err) {
        setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, visible: post.visible } : p)));
        setError(err instanceof Error ? err.message : "Falha ao alterar.");
      }
    });
  }

  function startEdit(post: InstagramPost) {
    setError(null);
    setEditingId(post.id);
    setDraft({ postUrl: post.post_url, caption: post.caption ?? "", isVideo: post.is_video });
  }

  function saveEdit(post: InstagramPost) {
    setError(null);
    startBusy(async () => {
      try {
        const updated = await updateInstagramPost(post.id, draft);
        setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
        setEditingId(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao guardar.");
      }
    });
  }

  function remove(post: InstagramPost) {
    setError(null);
    startBusy(async () => {
      try {
        await deleteInstagramPost(post.id);
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        setConfirmDeleteId(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao remover.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Como aparece na Home */}
      <form onSubmit={handleSaveSettings} className="flex flex-col gap-5 border border-border p-6">
        <h2 className="font-display text-lg text-accent">Como aparece na Home</h2>

        <div>
          <span className={labelClass}>Seção “No Instagram”</span>
          <div className="flex gap-3">
            {[
              { value: true, label: "Ligada" },
              { value: false, label: "Desligada" },
            ].map((option) => (
              <button
                key={String(option.value)}
                type="button"
                aria-pressed={settings.enabled === option.value}
                onClick={() => {
                  setSettings((s) => ({ ...s, enabled: option.value }));
                  setSettingsSaved(false);
                }}
                className={`flex-1 border px-4 py-3 text-sm transition-colors ${
                  settings.enabled === option.value ? "border-accent text-accent" : "border-border text-foreground-muted hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {settings.enabled && posts.every((p) => !p.visible) && (
            <p className="mt-2 text-xs text-foreground-muted">Ainda sem posts visíveis: a seção só aparece depois que houver pelo menos um.</p>
          )}
        </div>

        <div>
          <span className={labelClass}>Layout</span>
          <div className="grid gap-3 sm:grid-cols-3">
            {LAYOUTS.map((layout) => (
              <button
                key={layout.value}
                type="button"
                aria-pressed={settings.layout === layout.value}
                onClick={() => {
                  setSettings((s) => ({ ...s, layout: layout.value }));
                  setSettingsSaved(false);
                }}
                className={`flex flex-col gap-1 border px-4 py-3 text-left transition-colors ${
                  settings.layout === layout.value ? "border-accent" : "border-border hover:border-accent/50"
                }`}
              >
                <span className={`text-sm ${settings.layout === layout.value ? "text-accent" : "text-foreground"}`}>{layout.title}</span>
                <span className="text-xs text-foreground-muted">{layout.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className={labelClass}>Quantos posts aparecem — {settings.maxPosts}</span>
          <input
            type="range"
            min={INSTAGRAM_LIMITS.maxPosts.min}
            max={INSTAGRAM_LIMITS.maxPosts.max}
            step={1}
            value={settings.maxPosts}
            onChange={(e) => {
              setSettings((s) => ({ ...s, maxPosts: Number(e.target.value) }));
              setSettingsSaved(false);
            }}
            className="w-full accent-accent"
          />
          <p className="mt-1.5 text-xs text-foreground-muted">
            Aparecem os primeiros {settings.maxPosts} posts visíveis, na ordem da lista abaixo.
          </p>
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={savingSettings || settingsUnchanged} className={primaryButton}>
            {savingSettings ? "A guardar..." : "Guardar"}
          </button>
          {settingsSaved && <span className="text-sm text-accent">Guardado ✓ (aparece no site em até 1 minuto)</span>}
        </div>
        {settingsError && (
          <p className="text-sm" style={{ color: "#a13f3f" }}>
            {settingsError}
          </p>
        )}
      </form>

      {/* Adicionar post */}
      <form onSubmit={handleAdd} className="flex flex-col gap-4 border border-border p-6">
        <h2 className="font-display text-lg text-accent">Adicionar um post</h2>
        <p className="text-sm text-foreground-muted">
          Salve a imagem da publicação (ou um print dela), escolha o arquivo aqui e cole o link do post. A imagem é reduzida
          automaticamente para ficar leve no site.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="relative flex aspect-square w-full shrink-0 cursor-pointer items-center justify-center overflow-hidden border border-dashed border-border text-center text-xs text-foreground-muted transition-colors hover:border-accent sm:w-40">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Imagem escolhida" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <span className="px-3">Clique para escolher a imagem</span>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              aria-label="Imagem do post"
              className="sr-only"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </label>

          <div className="flex flex-1 flex-col gap-4">
            <label className="block">
              <span className={labelClass}>Link do post ou reel</span>
              <input
                type="url"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://www.instagram.com/p/…"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Legenda curta (opcional)</span>
              <input
                type="text"
                value={caption}
                maxLength={160}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Aparece sobre a imagem quando o mouse passa"
                className={inputClass}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={adding || !file || !postUrl.trim()} className={primaryButton}>
            {adding ? "A enviar..." : "Adicionar post"}
          </button>
          <span className="text-xs text-foreground-muted">Links de /reel/ ganham o marcador de vídeo automaticamente.</span>
        </div>
      </form>

      {error && (
        <p role="alert" className="text-sm" style={{ color: "#a13f3f" }}>
          {error}
        </p>
      )}

      {/* Lista */}
      <div>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-lg text-accent">Posts ({posts.length})</h2>
          {posts.length > 1 && <span className="text-xs text-foreground-muted">Arraste ou use as setas para mudar a ordem.</span>}
        </div>

        {posts.length === 0 ? (
          <p className="border border-border p-6 text-sm text-foreground-muted">Nenhum post ainda. Adicione o primeiro acima.</p>
        ) : (
          <ul className="border border-border">
            {posts.map((post, index) => {
              const editing = editingId === post.id;
              const outsideLimit = post.visible && !shownIds.has(post.id);
              return (
                <li
                  key={post.id}
                  draggable={!editing}
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={() => setDragIndex(null)}
                  className={`flex flex-col gap-3 border-b border-border p-4 last:border-b-0 sm:flex-row ${
                    dragIndex === index ? "opacity-40" : ""
                  } ${!post.visible ? "bg-background-raised/50" : ""}`}
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-background-raised">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.image_url} alt="" className={`h-full w-full object-cover ${!post.visible ? "opacity-50" : ""}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    {editing ? (
                      <div className="flex flex-col gap-3">
                        <label className="block">
                          <span className={labelClass}>Link do post</span>
                          <input type="url" value={draft.postUrl} onChange={(e) => setDraft((d) => ({ ...d, postUrl: e.target.value }))} className={inputClass} />
                        </label>
                        <label className="block">
                          <span className={labelClass}>Legenda</span>
                          <input type="text" value={draft.caption} maxLength={160} onChange={(e) => setDraft((d) => ({ ...d, caption: e.target.value }))} className={inputClass} />
                        </label>
                        <label className="flex items-center gap-2 text-sm text-foreground-muted">
                          <input type="checkbox" checked={draft.isVideo} onChange={(e) => setDraft((d) => ({ ...d, isVideo: e.target.checked }))} />
                          Mostrar o marcador de vídeo
                        </label>
                        <div className="flex gap-4">
                          <button type="button" disabled={busy} onClick={() => saveEdit(post)} className={primaryButton}>
                            Guardar
                          </button>
                          <button type="button" onClick={() => setEditingId(null)} className={smallButton}>
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <a
                          href={post.post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate text-sm text-foreground hover:text-accent"
                        >
                          {post.post_url.replace("https://www.instagram.com", "instagram.com")}
                        </a>
                        <p className="mt-1 line-clamp-2 text-sm text-foreground-muted">{post.caption || "Sem legenda"}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {post.is_video && <span className="border border-border px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-foreground-muted">Vídeo</span>}
                          {!post.visible && <span className="border border-accent px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-accent">Oculto</span>}
                          {outsideLimit && (
                            <span className="border border-border px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-foreground-muted">
                              Fora do limite da Home
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {!editing && (
                    <div className="flex shrink-0 flex-wrap items-start gap-x-4 gap-y-2 sm:w-44 sm:justify-end">
                      <button type="button" disabled={busy || index === 0} onClick={() => move(index, -1)} aria-label="Subir" className={smallButton}>
                        ↑
                      </button>
                      <button type="button" disabled={busy || index === posts.length - 1} onClick={() => move(index, 1)} aria-label="Descer" className={smallButton}>
                        ↓
                      </button>
                      <button type="button" disabled={busy} onClick={() => toggleVisible(post)} className={smallButton}>
                        {post.visible ? "Ocultar" : "Mostrar"}
                      </button>
                      <button type="button" onClick={() => startEdit(post)} className={smallButton}>
                        Editar
                      </button>
                      {confirmDeleteId === post.id ? (
                        <span className="flex items-center gap-3 text-xs">
                          <button type="button" disabled={busy} onClick={() => remove(post)} className="uppercase tracking-[0.08em]" style={{ color: "#a13f3f" }}>
                            Confirmar
                          </button>
                          <button type="button" onClick={() => setConfirmDeleteId(null)} className={smallButton}>
                            Não
                          </button>
                        </span>
                      ) : (
                        <button type="button" onClick={() => setConfirmDeleteId(post.id)} className={smallButton}>
                          Remover
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
