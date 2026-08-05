// Tipos puros do Hero por imóvel — mesmo formato do home_hero
// (lib/home-hero-types.ts), só que com property_id. Reexporta os tipos de
// item/layout de lá em vez de duplicar (só a "moldura" do registo muda).

export type { HeroLayout, HeroMediaType, HeroItem } from "./home-hero-types";
export { itemCountForLayout } from "./home-hero-types";

import type { HeroLayout, HeroMediaType, HeroItem } from "./home-hero-types";

export type PropertyHero = {
  id: string;
  property_id: string;
  media_type: HeroMediaType;
  layout: HeroLayout;
  items: HeroItem[];
  updated_at: string;
};
