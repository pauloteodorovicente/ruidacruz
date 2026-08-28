import { createClient } from "@/lib/supabase/server";

export type {
  PropertyType,
  PropertyStatus,
  EnergyCertificate,
  LayoutMode,
  Locale,
  Property,
  PropertyPhoto,
  PropertyFloorplan,
  PropertyTranslation,
} from "@/lib/property-types";
export { recommendLayoutMode } from "@/lib/property-types";

import type { Property, PropertyPhoto, PropertyFloorplan, PropertyTranslation, Locale } from "@/lib/property-types";

export async function getProperties(): Promise<Property[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPropertyByReference(reference: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getPropertyPhotos(propertyId: string): Promise<PropertyPhoto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_photos")
    .select("*")
    .eq("property_id", propertyId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// Capa de cada imóvel (primeira foto, position 0) pra grades/carrosséis que
// mostram vários imóveis de uma vez (Coleção Curada da Home) — uma consulta
// só pra todos os IDs, em vez de N chamadas de getPropertyPhotos. Achado
// (24/08): a Home usava um mapeamento fixo por referência com fallback pra
// uma foto específica da Leça do Balio — qualquer imóvel novo sem foto (ex.
// um rascunho recém-criado) acabava mostrando a fachada da Leça por engano.
export async function getCoverImages(propertyIds: string[]): Promise<Record<string, string>> {
  if (propertyIds.length === 0) return {};
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_photos")
    .select("property_id, storage_path, position")
    .in("property_id", propertyIds)
    .eq("visible", true)
    .order("position", { ascending: true });

  if (error) throw error;
  // Não assume que a primeira foto de cada imóvel está sempre na position 0
  // (uma foto removida no meio pode deixar buraco) — pega a de menor
  // position mesmo, já que a query veio ordenada.
  const result: Record<string, string> = {};
  for (const row of data ?? []) {
    if (!(row.property_id in result)) result[row.property_id] = row.storage_path;
  }
  return result;
}

export async function getPropertyFloorplans(propertyId: string): Promise<PropertyFloorplan[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_floorplans")
    .select("*")
    .eq("property_id", propertyId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getPropertyTranslation(
  propertyId: string,
  locale: Locale
): Promise<PropertyTranslation | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_translations")
    .select("*")
    .eq("property_id", propertyId)
    .eq("locale", locale)
    .maybeSingle();

  if (error) throw error;
  return data;
}
