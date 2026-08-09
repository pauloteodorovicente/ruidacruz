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
