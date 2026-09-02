// Tipos e funções puras do Hero da Home — sem dependência de servidor, pra
// poder ser importado de Client Components (ex.: HeroEditor) sem arrastar o
// cliente do Supabase pro bundle do navegador (mesmo motivo de
// lib/property-types.ts). lib/home-hero.ts (server-only) reexporta daqui.

export type HeroLayout = "single" | "duo" | "trio" | "quad" | "penta";
export type HeroMediaType = "image" | "video";

export type HeroItem = {
  src: string;
  kind: "image" | "video";
  position_x: number; // 0-100, object-position X
  position_y: number; // 0-100, object-position Y
  zoom: number; // 1-2.5, transform: scale()
  label?: string;
  // Frame de capa pro item de vídeo — evita o navegador mostrar um retângulo
  // preto/em branco antes do primeiro frame carregar, e serve de miniatura
  // onde o vídeo aparece fora do Hero (ex.: galeria do imóvel). Opcional —
  // sem isso, o navegador usa o comportamento padrão dele.
  poster?: string;
};

export type HomeHero = {
  id: string;
  media_type: HeroMediaType;
  layout: HeroLayout;
  items: HeroItem[];
  updated_at: string;
};

const LAYOUT_ITEM_COUNT: Record<HeroLayout, number> = {
  single: 1,
  duo: 2,
  trio: 3,
  quad: 4,
  penta: 5,
};

export function itemCountForLayout(layout: HeroLayout): number {
  return LAYOUT_ITEM_COUNT[layout];
}
