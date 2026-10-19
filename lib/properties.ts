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
export type { CardCover } from "@/lib/cover";

import type { Property, PropertyPhoto, PropertyFloorplan, PropertyTranslation, Locale } from "@/lib/property-types";
import {
  LEGACY_COVER_BY_REFERENCE,
  LEGACY_EXTRA_IMAGES_BY_REFERENCE,
  coverFirstOrder,
  resolveCover,
  type CardCarouselSettings,
  type CardCover,
} from "@/lib/cover";

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

// "reference" aqui é o trecho da URL: aceita tanto a referência (nº REMAX) quanto
// o slug amigável do imóvel — as duas URLs precisam achar a mesma ficha (a
// página redireciona a antiga pra amigável). Duas consultas simples em vez de
// um .or() com o texto da URL dentro do filtro (evita injetar vírgula/parêntese
// no PostgREST).
export async function getPropertyByReference(reference: string): Promise<Property | null> {
  const supabase = await createClient();
  const byReference = await supabase.from("properties").select("*").eq("reference", reference).maybeSingle();
  if (byReference.error) throw byReference.error;
  if (byReference.data) return byReference.data;

  const bySlug = await supabase.from("properties").select("*").eq("slug", reference).maybeSingle();
  if (bySlug.error) throw bySlug.error;
  return bySlug.data;
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

// Capas dos cards (Home, Portfólio) — uma consulta só pra todos os imóveis, em
// vez de N chamadas de getPropertyPhotos. Aplica a regra única de lib/cover.ts:
// capa definida no admin > capa que a landing já tinha no código (as 4 de
// campanha) > primeira foto visível > nenhuma (o card mostra a assinatura do
// Rui). Achado 24/08: o mapeamento fixo antigo tinha fallback pra uma foto da
// Leça do Balio, e qualquer imóvel novo sem foto mostrava a fachada dela.
//
// `carousel` liga o giro automático (C-3): só gira quem tem mais de uma foto e
// não está desligado na exceção do imóvel (cover_carousel). Sem `carousel`,
// cada card mostra só a capa.
export async function getCardCovers(
  properties: Pick<Property, "id" | "reference" | "cover_photo_id" | "cover_carousel">[],
  carousel?: CardCarouselSettings,
): Promise<Record<string, CardCover>> {
  if (properties.length === 0) return {};
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_photos")
    .select("id, property_id, storage_path, position, visible, media_type")
    .in(
      "property_id",
      properties.map((property) => property.id),
    )
    .eq("visible", true)
    .order("position", { ascending: true });
  if (error) throw error;

  const byProperty = new Map<string, PropertyPhoto[]>();
  for (const row of (data ?? []) as PropertyPhoto[]) {
    const list = byProperty.get(row.property_id) ?? [];
    list.push(row);
    byProperty.set(row.property_id, list);
  }

  const result: Record<string, CardCover> = {};
  for (const property of properties) {
    const photos = byProperty.get(property.id) ?? [];
    const { source } = resolveCover(photos, property.cover_photo_id);
    let paths = coverFirstOrder(photos, property.cover_photo_id).map((photo) => photo.storage_path);
    const legacy = LEGACY_COVER_BY_REFERENCE[property.reference];
    if (legacy && source !== "explicit") paths = [legacy, ...paths.filter((path) => path !== legacy)];
    // Páginas de campanha com pouca foto no banco: imagens fixas extras logo depois da capa.
    const extras = LEGACY_EXTRA_IMAGES_BY_REFERENCE[property.reference] ?? [];
    if (extras.length > 0) {
      const first = paths[0] ?? extras[0];
      paths = [first, ...extras.filter((path) => path !== first), ...paths.filter((path) => path !== first && !extras.includes(path))];
    }
    if (paths.length === 0) continue; // sem foto nenhuma: o card mostra a assinatura

    const rotate = Boolean(carousel && (property.cover_carousel ?? carousel.enabled) && paths.length > 1);
    result[property.id] = {
      photos: rotate ? paths.slice(0, carousel!.maxPhotos) : paths.slice(0, 1),
      rotate,
    };
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
