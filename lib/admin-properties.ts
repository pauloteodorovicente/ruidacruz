import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Property } from "@/lib/property-types";

// Busca via service role (bypassa RLS) — necessário porque o gate do /admin
// é uma senha simples, não uma sessão real do Supabase Auth, então
// auth.role() nunca é 'authenticated' pra essas chamadas. Sem isso,
// imóveis ainda não publicados ficariam invisíveis até no próprio painel.

export async function getAllPropertiesForAdmin(): Promise<Property[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPropertyByReferenceForAdmin(reference: string): Promise<Property | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Link de pré-visualização temporário — token confere e a expiração é
// checada aqui mesmo, na leitura (ver comentário na migration 0015).
export async function getPropertyByReferenceWithPreviewToken(reference: string, token: string): Promise<Property | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("reference", reference)
    .eq("preview_token", token)
    .maybeSingle();

  if (error) throw error;
  if (!data || !data.preview_token_expires_at) return null;
  if (new Date(data.preview_token_expires_at).getTime() < Date.now()) return null;
  return data;
}

export type OffMarketTeaser = {
  id: string;
  reference: string;
  title: string;
  zone: string | null;
  ghl_zone: string | null;
  municipality: string | null;
  property_type: Property["property_type"];
  typology: string | null;
  business_type: Property["business_type"];
};

// A RLS já esconde imóveis off_market de qualquer leitura pública (ver
// migration 0001_init.sql, policy properties_public_read) — o visitante que
// cai numa dessas fichas hoje só vê 404, sem chance de pedir acesso. Esta
// busca (service role, só campos seguros pra mostrar — nunca preço,
// endereço exato, descrição completa) existe pra dar um teaser + formulário
// de pedido em vez do 404 seco.
export async function getOffMarketTeaser(reference: string): Promise<OffMarketTeaser | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("id, reference, title, zone, ghl_zone, municipality, property_type, typology, business_type")
    .eq("reference", reference)
    .eq("status", "off_market")
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}
