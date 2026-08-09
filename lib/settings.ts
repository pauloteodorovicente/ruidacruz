import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type MetaPixelSettings = {
  pixelId: string;
  // Vazio = sem restrição (comportamento aplicado depende de autoInstallNewPages).
  pages: string[];
  // true: instala em toda página nova por padrão, exceto /admin (comportamento
  // de hoje). false: instala só nas páginas listadas em "pages".
  autoInstallNewPages: boolean;
};

export type GhlSettings = {
  apiToken: string;
  locationId: string;
};

const DEFAULT_META_PIXEL: MetaPixelSettings = {
  pixelId: "2026495607919533",
  pages: [],
  autoInstallNewPages: true,
};

export async function getMetaPixelSettings(): Promise<MetaPixelSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("value").eq("key", "meta_pixel").maybeSingle();
  if (!data?.value) return DEFAULT_META_PIXEL;
  return { ...DEFAULT_META_PIXEL, ...(data.value as Partial<MetaPixelSettings>) };
}

// Só em contexto de servidor confiável (Route Handlers) — nunca exposto ao
// navegador. Usa o admin client porque a chave "ghl" é bloqueada pra leitura
// pública via RLS.
export async function getGhlSettings(): Promise<GhlSettings | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("settings").select("value").eq("key", "ghl").maybeSingle();
  const value = data?.value as Partial<GhlSettings> | undefined;
  if (!value?.apiToken || !value?.locationId) return null;
  return { apiToken: value.apiToken, locationId: value.locationId };
}
