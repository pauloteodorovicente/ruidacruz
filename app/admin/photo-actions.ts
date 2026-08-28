"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

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
