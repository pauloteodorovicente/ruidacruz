"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeSectionOrder } from "@/lib/section-order";

const BUCKET = "property-photos";

export async function uploadPhotos(propertyId: string, propertyReference: string, formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return;

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("property_photos")
    .select("position")
    .eq("property_id", propertyId)
    .order("position", { ascending: false })
    .limit(1);
  let nextPosition = (existing?.[0]?.position ?? -1) + 1;

  for (const file of files) {
    const path = `${propertyId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const { error: insertError } = await supabase
      .from("property_photos")
      .insert({ property_id: propertyId, storage_path: publicUrl.publicUrl, position: nextPosition });
    if (insertError) throw new Error(insertError.message);
    nextPosition++;
  }

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  revalidatePath(`/imoveis/${propertyReference}`);
}

export async function deletePhoto(photoId: string, propertyReference: string) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: photo } = await supabase.from("property_photos").select("storage_path").eq("id", photoId).maybeSingle();
  if (photo) {
    const path = photo.storage_path.split(`/${BUCKET}/`)[1];
    if (path) await supabase.storage.from(BUCKET).remove([path]);
  }
  await supabase.from("property_photos").delete().eq("id", photoId);

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  revalidatePath(`/imoveis/${propertyReference}`);
}

// Reordenação por arrastar-e-soltar — recebe a ordem final já calculada no
// cliente e grava a posição de cada foto de uma vez, em vez do swap par-a-par
// que as setinhas usam (não dá pra mover de qualquer posição pra qualquer
// outra só trocando vizinhos).
export async function reorderPhotos(propertyId: string, propertyReference: string, orderedPhotoIds: string[]) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  await Promise.all(
    orderedPhotoIds.map((photoId, position) =>
      supabase.from("property_photos").update({ position }).eq("id", photoId).eq("property_id", propertyId)
    )
  );

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  revalidatePath(`/imoveis/${propertyReference}`);
}

// direction aceita qualquer delta, não só ±1 — as setinhas de cima/baixo
// (pedido do Paulo, 24/08) pulam uma linha inteira da grade (±4, largura de
// desktop), não só um vizinho lateral.
export async function movePhoto(photoId: string, propertyId: string, propertyReference: string, direction: number) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: photos } = await supabase
    .from("property_photos")
    .select("id, position")
    .eq("property_id", propertyId)
    .order("position", { ascending: true });
  if (!photos) return;

  const idx = photos.findIndex((p) => p.id === photoId);
  const swapIdx = idx + direction;
  if (idx < 0 || swapIdx < 0 || swapIdx >= photos.length) return;

  const a = photos[idx];
  const b = photos[swapIdx];
  await supabase.from("property_photos").update({ position: b.position }).eq("id", a.id);
  await supabase.from("property_photos").update({ position: a.position }).eq("id", b.id);

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  revalidatePath(`/imoveis/${propertyReference}`);
}

// Define (ou limpa, com null) qual foto é a CAPA do imóvel — cards da Home e
// do Portfólio, Hero da ficha quando não há hero próprio e prévia de link —
// sem mexer na ordem da galeria (pedido do Paulo, 09/10). Sem capa definida
// vale a primeira foto visível (lib/cover.ts). Foto arquivada não serve de capa.
export async function setCoverPhoto(propertyId: string, propertyReference: string, photoId: string | null) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  if (photoId) {
    const { data: photo } = await supabase
      .from("property_photos")
      .select("id, visible")
      .eq("id", photoId)
      .eq("property_id", propertyId)
      .maybeSingle();
    if (!photo) throw new Error("Essa foto não pertence a este imóvel.");
    if (!photo.visible) throw new Error("Foto arquivada não pode ser a capa — publique-a de novo antes.");
  }

  const { error } = await supabase.from("properties").update({ cover_photo_id: photoId }).eq("id", propertyId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  revalidatePath(`/imoveis/${propertyReference}`);
  revalidatePath("/", "layout");
}

// "Arquivar" uma foto sem apagar (pedido do Paulo, 24/08) — some da página
// pública mas continua existindo e editável no admin, pra poder trazer de
// volta depois sem reenviar o arquivo.
export async function togglePhotoVisibility(photoId: string, propertyReference: string, visible: boolean) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  await supabase.from("property_photos").update({ visible }).eq("id", photoId);

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  revalidatePath(`/imoveis/${propertyReference}`);
}

// Envia UMA foto e já a define como capa (pedido do Paulo, 18/10: "definir capa tem que
// ser possível pelo admin" em qualquer imóvel). Serve sobretudo às landings cujas fotos
// moram no código (Verdelago, Portimão...) e não têm foto nenhuma no banco para marcar:
// a foto enviada entra na lista de fotos do imóvel (no fim) e vira a capa dos cards.
export async function uploadCoverPhoto(propertyId: string, propertyReference: string, formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const file = formData.getAll("cover").find((f): f is File => f instanceof File && f.size > 0);
  if (!file) throw new Error("Escolha uma foto para a capa.");
  if (!file.type.startsWith("image/")) throw new Error("O arquivo precisa ser uma imagem.");

  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("property_photos")
    .select("position")
    .eq("property_id", propertyId)
    .order("position", { ascending: false })
    .limit(1);
  const position = (existing?.[0]?.position ?? -1) + 1;

  const path = `${propertyId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const { data: inserted, error: insertError } = await supabase
    .from("property_photos")
    .insert({ property_id: propertyId, storage_path: publicUrl.publicUrl, position })
    .select("id")
    .single();
  if (insertError) throw new Error(insertError.message);

  const { error } = await supabase.from("properties").update({ cover_photo_id: inserted.id }).eq("id", propertyId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  revalidatePath(`/imoveis/${propertyReference}`);
  revalidatePath("/", "layout");
}

// Mídia em destaque da galeria (2x2, ocupa o espaço de 4): id de uma foto visível do
// imóvel, ou "video" (o vídeo do Hero); null tira o destaque.
export async function setGalleryFeatured(propertyId: string, propertyReference: string, media: string | null) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  if (media === "video") {
    const { data: hero } = await supabase.from("property_hero").select("media_type").eq("property_id", propertyId).maybeSingle();
    if (hero?.media_type !== "video") throw new Error("Este imóvel não tem vídeo no Hero.");
  } else if (media) {
    const { data: photo } = await supabase
      .from("property_photos")
      .select("id, visible")
      .eq("id", media)
      .eq("property_id", propertyId)
      .maybeSingle();
    if (!photo) throw new Error("Essa foto não pertence a este imóvel.");
    if (!photo.visible) throw new Error("Foto arquivada não pode ser destacada — publique-a de novo antes.");
  }

  const { error } = await supabase.from("properties").update({ gallery_featured: media }).eq("id", propertyId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  revalidatePath(`/imoveis/${propertyReference}`);
}

// Liga/desliga o vídeo do Hero como primeiro quadro da grade da galeria.
export async function setGalleryVideoInGrid(propertyId: string, propertyReference: string, on: boolean) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  const { error } = await supabase.from("properties").update({ gallery_video_in_grid: on }).eq("id", propertyId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  revalidatePath(`/imoveis/${propertyReference}`);
}

// Ordem das seções da ficha (Layout da página). null volta à ordem padrão do modelo.
export async function saveSectionOrder(propertyId: string, propertyReference: string, order: string[] | null) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const clean = order === null ? null : sanitizeSectionOrder(order);
  const supabase = createAdminClient();
  const { error } = await supabase.from("properties").update({ section_order: clean }).eq("id", propertyId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  revalidatePath(`/imoveis/${propertyReference}`);
}

// Vídeo na galeria (Paulo, 18/10: "destacar qualquer mídia"). O arquivo é grande demais para
// passar pelo servidor (o limite da hospedagem é de poucos MB), então o navegador envia direto
// ao armazenamento com um link assinado e este servidor só autoriza e registra.
export async function createGalleryVideoUpload(
  propertyId: string,
  fileName: string,
): Promise<{ path: string; token: string }> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80) || "video.mp4";
  const path = `${propertyId}/videos/${Date.now()}-${safeName}`;
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? "Não consegui preparar o envio do vídeo.");
  return { path, token: data.token };
}

export async function addGalleryVideo(propertyId: string, propertyReference: string, path: string) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  if (!path.startsWith(`${propertyId}/videos/`)) throw new Error("Caminho de vídeo inválido.");

  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("property_photos")
    .select("position")
    .eq("property_id", propertyId)
    .order("position", { ascending: false })
    .limit(1);
  const position = (existing?.[0]?.position ?? -1) + 1;

  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const { error } = await supabase
    .from("property_photos")
    .insert({ property_id: propertyId, storage_path: publicUrl.publicUrl, position, media_type: "video" });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  revalidatePath(`/imoveis/${propertyReference}`);
}
