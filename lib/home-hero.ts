import { createClient } from "@/lib/supabase/server";

export type { HeroLayout, HeroMediaType, HeroItem, HomeHero } from "@/lib/home-hero-types";
export { itemCountForLayout } from "@/lib/home-hero-types";

import type { HomeHero } from "@/lib/home-hero-types";

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
