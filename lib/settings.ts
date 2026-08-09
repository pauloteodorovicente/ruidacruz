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

// Chamado a partir do layout raiz — usa fetch() puro (sem cookies()) de
// propósito, pra não forçar renderização dinâmica em toda página do site só
// por causa de uma leitura pública que muda raramente. Cache de 60s.
export async function getMetaPixelSettings(): Promise<MetaPixelSettings> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return DEFAULT_META_PIXEL;

  try {
    const res = await fetch(`${url}/rest/v1/settings?select=value&key=eq.meta_pixel`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return DEFAULT_META_PIXEL;
    const rows = (await res.json()) as { value: Partial<MetaPixelSettings> }[];
    if (!rows[0]?.value) return DEFAULT_META_PIXEL;
    return { ...DEFAULT_META_PIXEL, ...rows[0].value };
  } catch {
    return DEFAULT_META_PIXEL;
  }
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
