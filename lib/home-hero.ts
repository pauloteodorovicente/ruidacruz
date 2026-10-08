import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type { HeroLayout, HeroMediaType, HeroItem, HomeHero, HeroCtaSettings } from "@/lib/home-hero-types";
export { itemCountForLayout } from "@/lib/home-hero-types";

import { HERO_CTA_DEFAULTS, isValidHeroHref } from "@/lib/home-hero-types";
import type { HomeHero, HeroCtaSettings } from "@/lib/home-hero-types";

function sanitizeCta(value: Partial<HeroCtaSettings> | null | undefined): HeroCtaSettings {
  return {
    primary: value?.primary && isValidHeroHref(value.primary) ? value.primary.trim() : HERO_CTA_DEFAULTS.primary,
    secondary:
      value?.secondary && isValidHeroHref(value.secondary) ? value.secondary.trim() : HERO_CTA_DEFAULTS.secondary,
  };
}

// Leitura pública (Home) — fetch puro com cache de 60s, igual aos outros
// getters de settings (ver lib/settings.ts), pra não forçar a Home a virar
// dinâmica. Valor inválido ou ausente cai no padrão.
export async function getHomeHeroCtaSettings(): Promise<HeroCtaSettings> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return HERO_CTA_DEFAULTS;
  try {
    const res = await fetch(`${url}/rest/v1/settings?select=value&key=eq.home_hero_cta`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return HERO_CTA_DEFAULTS;
    const rows = (await res.json()) as { value: Partial<HeroCtaSettings> }[];
    return sanitizeCta(rows[0]?.value);
  } catch {
    return HERO_CTA_DEFAULTS;
  }
}

// Leitura do painel — sem cache, pra o formulário nunca mostrar um valor velho
// logo depois de guardar.
export async function getHomeHeroCtaSettingsForAdmin(): Promise<HeroCtaSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("settings").select("value").eq("key", "home_hero_cta").maybeSingle();
  return sanitizeCta(data?.value as Partial<HeroCtaSettings> | undefined);
}

// Singleton — sempre a linha mais recente (por segurança, caso mais de uma
// exista um dia; a UI do painel sempre faz upsert na mesma).
export async function getHomeHero(): Promise<HomeHero | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("home_hero")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}
