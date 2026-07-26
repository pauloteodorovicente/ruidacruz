import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente privilegiado (bypassa RLS) — só pra uso em Server Actions/Route
// Handlers do /admin, sempre atrás de isAdminAuthenticated(). Nunca importar
// isso de um Client Component nem devolver essa chave pro navegador.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin não configurado: falta SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
