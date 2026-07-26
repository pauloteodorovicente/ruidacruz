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
