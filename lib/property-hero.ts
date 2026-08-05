import { createClient } from "@/lib/supabase/server";

export type { HeroLayout, HeroMediaType, HeroItem, PropertyHero } from "@/lib/property-hero-types";
export { itemCountForLayout } from "@/lib/property-hero-types";

import type { PropertyHero } from "@/lib/property-hero-types";

export async function getPropertyHero(propertyId: string): Promise<PropertyHero | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_hero")
    .select("*")
    .eq("property_id", propertyId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
