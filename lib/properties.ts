import { createClient } from "@/lib/supabase/server";

export type PropertyType = "moradia" | "apartamento" | "terreno" | "outro";
export type PropertyStatus = "disponivel" | "reservado" | "vendido" | "off_market";
export type EnergyCertificate = "A+" | "A" | "B" | "B-" | "C" | "D" | "E" | "F";
export type LayoutMode = "arquitetura" | "paisagem_terreno" | "urbano";
export type Locale = "pt-PT" | "pt-BR" | "en" | "es" | "fr" | "it" | "de";

export type Property = {
  id: string;
  reference: string;
  title: string;
  property_type: PropertyType;
  typology: string | null;
  status: PropertyStatus;
  featured: boolean;
  zone: string | null;
  municipality: string | null;
  map_url: string | null;
  price: number | null;
  price_on_application: boolean;
  land_area_sqm: number | null;
  construction_area_sqm: number | null;
  parking: string | null;
  construction_year: number | null;
  energy_certificate: EnergyCertificate | null;
  description: string | null;
  highlights: string[];
  architect: string | null;
  landscaper: string | null;
  layout_mode: LayoutMode;
  layout_mode_overridden: boolean;
  source_locale: string;
  created_at: string;
  updated_at: string;
};

export type PropertyPhoto = {
  id: string;
  property_id: string;
  storage_path: string;
  position: number;
};

export type PropertyTranslation = {
  id: string;
  property_id: string;
  locale: Locale;
  title: string | null;
  description: string | null;
  highlights: string[];
  translation_source: "ai" | "human";
};

// Regra automática de recomendação de tema — Fase 5. Heurística inicial simples,
// afinar quando o inventário real chegar. Rui pode sempre sobrescrever no painel.
export function recommendLayoutMode(property: Pick<Property, "property_type" | "architect">): LayoutMode {
  if (property.property_type === "apartamento") return "urbano";
  if (property.architect) return "arquitetura";
  return "paisagem_terreno";
}

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
