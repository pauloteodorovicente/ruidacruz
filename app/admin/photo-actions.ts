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

export async function movePhoto(photoId: string, propertyId: string, propertyReference: string, direction: -1 | 1) {
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
