"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "property-photos"; // mesmo bucket das fotos, pasta separada por convenção de path

export async function uploadFloorplan(propertyId: string, propertyReference: string, formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const file = formData.get("file");
  const floorLabel = String(formData.get("floor_label") ?? "").trim();
  if (!(file instanceof File) || file.size === 0 || !floorLabel) return;

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("property_floorplans")
    .select("position")
    .eq("property_id", propertyId)
    .order("position", { ascending: false })
    .limit(1);
  const nextPosition = (existing?.[0]?.position ?? -1) + 1;

  const path = `property-floorplans/${propertyId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const { error: insertError } = await supabase.from("property_floorplans").insert({
    property_id: propertyId,
    storage_path: publicUrl.publicUrl,
    floor_label: floorLabel,
    position: nextPosition,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  revalidatePath(`/imoveis/${propertyReference}`);
}

export async function deleteFloorplan(id: string, propertyReference: string) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: floorplan } = await supabase
    .from("property_floorplans")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  if (floorplan) {
    const path = floorplan.storage_path.split(`/${BUCKET}/`)[1];
    if (path) await supabase.storage.from(BUCKET).remove([path]);
  }
  await supabase.from("property_floorplans").delete().eq("id", id);

  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  revalidatePath(`/imoveis/${propertyReference}`);
}
