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

export type SchedulingSettings = {
  link: string;
};

export type HomeCollectionSettings = {
  layout: "grid" | "carousel";
};

export type SellerCtaSettings = {
  enabled: boolean;
};

const DEFAULT_META_PIXEL: MetaPixelSettings = {
  pixelId: "2026495607919533",
  pages: [],
  autoInstallNewPages: true,
};

const DEFAULT_SCHEDULING: SchedulingSettings = { link: "" };
const DEFAULT_HOME_COLLECTION: HomeCollectionSettings = { layout: "grid" };
// Ligado por padrão — pedido do Rui via WhatsApp (13/08), aparece assim que
// a branch for aprovada, sem precisar de um passo extra no admin pra ativar.
const DEFAULT_SELLER_CTA: SellerCtaSettings = { enabled: true };

// Leitura pública genérica — fetch() puro (sem cookies()) de propósito, pra
// não forçar renderização dinâmica em toda página que a chamar só por causa
// de dado público que muda raramente. Cache de 60s.
async function getPublicSetting<T>(key: string, fallback: T): Promise<T> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return fallback;

  try {
    const res = await fetch(`${url}/rest/v1/settings?select=value&key=eq.${key}`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallback;
    const rows = (await res.json()) as { value: Partial<T> }[];
    if (!rows[0]?.value) return fallback;
    return { ...fallback, ...rows[0].value };
  } catch {
    return fallback;
  }
}

export async function getMetaPixelSettings(): Promise<MetaPixelSettings> {
  return getPublicSetting("meta_pixel", DEFAULT_META_PIXEL);
}

export async function getSchedulingSettings(): Promise<SchedulingSettings> {
  return getPublicSetting("scheduling", DEFAULT_SCHEDULING);
}

export async function getHomeCollectionSettings(): Promise<HomeCollectionSettings> {
  return getPublicSetting("home_collection", DEFAULT_HOME_COLLECTION);
}

export async function getSellerCtaSettings(): Promise<SellerCtaSettings> {
  return getPublicSetting("seller_cta", DEFAULT_SELLER_CTA);
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
