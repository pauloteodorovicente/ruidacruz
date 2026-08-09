import "server-only";
import { createClient } from "@/lib/supabase/server";

export type PropertyTypology = {
  id: string;
  property_id: string;
  name: string;
  description: string | null;
  price_from: number | null;
  position: number;
};

export type TypologyFloorplan = {
  id: string;
  typology_id: string;
  storage_path: string;
  position: number;
};

export type PropertyUnit = {
  id: string;
  property_id: string;
  typology_id: string | null;
  phase_label: string | null;
  lot: string | null;
  fraction: string | null;
  price: number | null;
  position: number;
};

export type TypologyTranslation = {
  id: string;
  typology_id: string;
  locale: string;
  name: string | null;
  description: string | null;
  translation_source: "ai" | "human";
};

// Leitura pública (cookie-based, respeita RLS) — usada pelas landings de
// campanha em runtime. Todas as 3 tabelas têm leitura pública liberada (são
// dados de marketing, não sensíveis), então não precisa do cliente admin
// aqui, ao contrário de getGhlSettings por exemplo.
export async function getPropertyTypologies(propertyId: string): Promise<PropertyTypology[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_typologies")
    .select("*")
    .eq("property_id", propertyId)
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getTypologyFloorplans(typologyIds: string[]): Promise<TypologyFloorplan[]> {
  if (typologyIds.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_typology_floorplans")
    .select("*")
    .in("typology_id", typologyIds)
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPropertyUnits(propertyId: string): Promise<PropertyUnit[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_units")
    .select("*")
    .eq("property_id", propertyId)
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getTypologyTranslations(typologyIds: string[]): Promise<TypologyTranslation[]> {
  if (typologyIds.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_typology_translations")
    .select("*")
    .in("typology_id", typologyIds);
  if (error) throw error;
  return data ?? [];
}
