"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { translateTypologyToAllLocales } from "@/lib/translate-typology";

const FLOORPLAN_BUCKET = "property-photos";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}
function numOrNull(formData: FormData, key: string): number | null {
  const value = str(formData, key);
  return value ? Number(value) : null;
}

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

function revalidateProperty(propertyReference: string, campaignPath: string | null) {
  revalidatePath(`/admin/imoveis/${propertyReference}/editar`);
  if (campaignPath) revalidatePath(campaignPath);
}

// --- Tipologias ---

export async function saveTypology(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const id = str(formData, "id");
  const propertyId = str(formData, "property_id");
  const propertyReference = str(formData, "property_reference");
  const campaignPath = str(formData, "campaign_path") || null;

  const record = {
    property_id: propertyId,
    name: str(formData, "name"),
    description: str(formData, "description") || null,
    price_from: numOrNull(formData, "price_from"),
  };
  if (!record.name) throw new Error("Nome da tipologia é obrigatório.");

  let typologyId = id;
  if (id) {
    const { error } = await supabase.from("property_typologies").update(record).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data: existing } = await supabase
      .from("property_typologies")
      .select("position")
      .eq("property_id", propertyId)
      .order("position", { ascending: false })
      .limit(1);
    const position = (existing?.[0]?.position ?? -1) + 1;
    const { data: inserted, error } = await supabase
      .from("property_typologies")
      .insert({ ...record, position })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    typologyId = inserted.id;
  }

  // Roda depois da resposta (after) — nunca trava salvar a tipologia
  // esperando o DeepL. Mesmo motivo/padrão de saveProperty.
  after(() => translateTypologyToAllLocales(typologyId, { name: record.name, description: record.description }));

  revalidateProperty(propertyReference, campaignPath);
}

export async function deleteTypology(id: string, propertyReference: string, campaignPath: string | null) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("property_typologies").delete().eq("id", id);
  revalidateProperty(propertyReference, campaignPath);
}

export async function uploadTypologyFloorplan(
  typologyId: string,
  propertyReference: string,
  campaignPath: string | null,
  formData: FormData,
) {
  await requireAdmin();
  const supabase = createAdminClient();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const { data: existing } = await supabase
    .from("property_typology_floorplans")
    .select("position")
    .eq("typology_id", typologyId)
    .order("position", { ascending: false })
    .limit(1);
  const position = (existing?.[0]?.position ?? -1) + 1;

  const path = `typologias/${typologyId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from(FLOORPLAN_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrl } = supabase.storage.from(FLOORPLAN_BUCKET).getPublicUrl(path);
  const { error: insertError } = await supabase
    .from("property_typology_floorplans")
    .insert({ typology_id: typologyId, storage_path: publicUrl.publicUrl, position });
  if (insertError) throw new Error(insertError.message);

  revalidateProperty(propertyReference, campaignPath);
}

export async function deleteTypologyFloorplan(id: string, propertyReference: string, campaignPath: string | null) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: floorplan } = await supabase
    .from("property_typology_floorplans")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  if (floorplan) {
    const path = floorplan.storage_path.split(`/${FLOORPLAN_BUCKET}/`)[1];
    if (path) await supabase.storage.from(FLOORPLAN_BUCKET).remove([path]);
  }
  await supabase.from("property_typology_floorplans").delete().eq("id", id);
  revalidateProperty(propertyReference, campaignPath);
}

// --- Unidades ---

export async function saveUnit(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  const id = str(formData, "id");
  const propertyId = str(formData, "property_id");
  const propertyReference = str(formData, "property_reference");
  const campaignPath = str(formData, "campaign_path") || null;
  const typologyId = str(formData, "typology_id");

  const record = {
    property_id: propertyId,
    typology_id: typologyId || null,
    phase_label: str(formData, "phase_label") || null,
    lot: str(formData, "lot") || null,
    fraction: str(formData, "fraction") || null,
    price: numOrNull(formData, "price"),
  };

  if (id) {
    const { error } = await supabase.from("property_units").update(record).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data: existing } = await supabase
      .from("property_units")
      .select("position")
      .eq("property_id", propertyId)
      .order("position", { ascending: false })
      .limit(1);
    const position = (existing?.[0]?.position ?? -1) + 1;
    const { error } = await supabase.from("property_units").insert({ ...record, position });
    if (error) throw new Error(error.message);
  }

  revalidateProperty(propertyReference, campaignPath);
}

export async function deleteUnit(id: string, propertyReference: string, campaignPath: string | null) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("property_units").delete().eq("id", id);
  revalidateProperty(propertyReference, campaignPath);
}
