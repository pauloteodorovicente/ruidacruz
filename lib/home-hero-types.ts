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

// Destino dos 2 botões de texto abaixo do Hero da Home ("Portfólio" e "Falar
// com Rui"). O RÓTULO de cada botão continua vindo das traduções (7 idiomas);
// só o DESTINO é editável no painel (/admin/hero) — achado 08/10: o 2º botão
// apontava pra "/#contacto", âncora que a Home nunca teve, então não levava a
// lugar nenhum.
export type HeroCtaSettings = {
  primary: string;
  secondary: string;
};

export const HERO_CTA_DEFAULTS: HeroCtaSettings = {
  primary: "/#colecao",
  secondary: "/contacto",
};

// Destinos prontos pro dropdown do painel — o Paulo/Rui escolhem sem digitar
// endereço. "Outro endereço" (campo livre) cobre o resto.
export const HERO_LINK_PRESETS: { value: string; label: string }[] = [
  { value: "/#colecao", label: "Coleção em destaque (mais abaixo, na própria Home)" },
  { value: "/portfolio", label: "Portfólio completo" },
  { value: "/contacto", label: "Página de contacto" },
  { value: "/vender", label: "Vender com o Rui" },
  { value: "/sobre", label: "Sobre o Rui" },
];

// Aceita só caminho interno ("/contacto", "/#colecao"), https://, mailto: ou
// tel: — nunca javascript:, data: etc. (o valor vira href de um link público).
export function isValidHeroHref(href: string): boolean {
  const value = href.trim();
  if (!value || value.length > 300 || /\s/.test(value)) return false;
  if (value.startsWith("/")) return !value.startsWith("//") && !value.includes("\\");
  if (value.startsWith("mailto:") || value.startsWith("tel:")) return value.length > 7;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.includes(".");
  } catch {
    return false;
  }
}

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
