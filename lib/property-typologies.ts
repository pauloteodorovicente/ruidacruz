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

// disponivel = à venda; vendido = aparece na tabela pública marcada como
// Vendido; oculto = fora da página (ex.: fração unida a outra) mas mantida no
// admin pra poder voltar atrás. Ver migração 0022_property_unit_status.sql.
export type UnitStatus = "disponivel" | "vendido" | "oculto";

export type PropertyUnit = {
  id: string;
  property_id: string;
  typology_id: string | null;
  phase_label: string | null;
  lot: string | null;
  fraction: string | null;
  price: number | null;
  position: number;
  featured: boolean;
  status: UnitStatus;
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

// Menor preço entre as frações ainda DISPONÍVEIS (vendidas e ocultas não contam) —
// alimenta o "a partir de" do Verdelago, que antes era um número fixo no código.
export async function getLowestAvailableUnitPrice(propertyId: string): Promise<number | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_units")
    .select("price")
    .eq("property_id", propertyId)
    .eq("status", "disponivel")
    .not("price", "is", null)
    .order("price", { ascending: true })
    .limit(1);
  if (error) throw error;
  const price = data?.[0]?.price;
  return price == null ? null : Number(price);
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

// "A partir de" dos cards da Home e do Portfólio (Backlog 15/10, item c): menor valor
// ainda DISPONÍVEL entre as frações do imóvel. Só entra quem tem frações com valor;
// os demais cards seguem mostrando o preço do imóvel. A landing da Fase 6 não tem
// frações próprias: usa as da referência "verdelago" com fase "Fase 6" (mesma regra
// de app/[locale]/verdelago6/page.tsx).
const FASE_6_REFERENCE = "verdelago6";
const FASE_6_SOURCE_REFERENCE = "verdelago";
const FASE_6_PHASE_LABEL = "Fase 6";

export async function getCardFromPrices(
  properties: { id: string; reference: string }[],
): Promise<Record<string, number>> {
  if (properties.length === 0) return {};
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_units")
    .select("property_id, price, phase_label")
    .eq("status", "disponivel")
    .not("price", "is", null);
  if (error) throw error;

  const units = (data ?? []) as { property_id: string; price: number | string; phase_label: string | null }[];
  const lowest = (rows: typeof units) => {
    const prices = rows.map((u) => Number(u.price)).filter((n) => Number.isFinite(n));
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const result: Record<string, number> = {};
  const sourceId = properties.find((p) => p.reference === FASE_6_SOURCE_REFERENCE)?.id;
  for (const property of properties) {
    if (property.reference === FASE_6_REFERENCE) {
      // Sem o imóvel de origem na lista, a Fase 6 não ganha "a partir de".
      const id = sourceId ?? (await idByReference(supabase, FASE_6_SOURCE_REFERENCE));
      const price = id ? lowest(units.filter((u) => u.property_id === id && u.phase_label === FASE_6_PHASE_LABEL)) : null;
      if (price != null) result[property.id] = price;
      continue;
    }
    const price = lowest(units.filter((u) => u.property_id === property.id));
    if (price != null) result[property.id] = price;
  }
  return result;
}

async function idByReference(supabase: Awaited<ReturnType<typeof createClient>>, reference: string) {
  const { data } = await supabase.from("properties").select("id").eq("reference", reference).maybeSingle();
  return (data?.id as string | undefined) ?? null;
}
