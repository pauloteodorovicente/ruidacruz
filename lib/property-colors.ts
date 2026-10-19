import type { PropertyType } from "./property-types";

// Paletas de cor da PÁGINA INTEIRA (fundo, cartões, texto, destaque, bordas) —
// pedido do Paulo (28/08 e 08/10/2026): escolher "Musgo" muda a página toda,
// não só o contorno do botão. Cada paleta tem as duas versões (escuro e claro),
// porque o visitante alterna o tema do site e nenhuma das duas pode ficar de
// fora. Esta é a ÚNICA fonte dos valores: o admin (seletor de cor, cores por
// tipo) lê daqui e o CSS que vai pra página é gerado daqui (paletteCss) — não
// existe mais uma cópia em globals.css pra manter em sincronia.
//
// "Terracota" é a identidade padrão do site (navy profundo + cobre): escolhê-la
// é o mesmo que não escolher nada, e não gera CSS nenhum (a página fica
// byte a byte como sempre foi).

export type ColorThemeSlug = "terracota" | "musgo" | "marinho" | "bordo" | "grafite" | "champanhe" | "creme";

export type PaletteTokens = {
  bg: string;
  bgRaised: string;
  fg: string;
  accent: string;
  accentStrong: string;
  accentDark: string;
};

export type ColorTheme = {
  slug: ColorThemeSlug;
  label: string;
  dark: PaletteTokens;
  light: PaletteTokens;
};

export const COLOR_THEMES: ColorTheme[] = [
  {
    slug: "terracota",
    label: "Terracota (padrão)",
    dark: { bg: "#040815", bgRaised: "#0a1024", fg: "#f5f3ef", accent: "#ce946e", accentStrong: "#e0ab86", accentDark: "#a66a42" },
    light: { bg: "#faf8f4", bgRaised: "#ffffff", fg: "#0c1220", accent: "#a3623a", accentStrong: "#b97a52", accentDark: "#8a5636" },
  },
  {
    slug: "musgo",
    label: "Musgo",
    dark: { bg: "#0a110c", bgRaised: "#111a13", fg: "#f0f2ea", accent: "#8ea67c", accentStrong: "#a8bd97", accentDark: "#6b8259" },
    light: { bg: "#f4f6ef", bgRaised: "#ffffff", fg: "#121a14", accent: "#587348", accentStrong: "#6f8a5f", accentDark: "#44592f" },
  },
  {
    slug: "marinho",
    label: "Marinho",
    dark: { bg: "#07142e", bgRaised: "#0d1f43", fg: "#eef2f9", accent: "#7d97c4", accentStrong: "#9ab0d6", accentDark: "#5c7aa8" },
    light: { bg: "#f2f5fa", bgRaised: "#ffffff", fg: "#0b1630", accent: "#3f5c8a", accentStrong: "#5878a8", accentDark: "#2f4a72" },
  },
  {
    slug: "bordo",
    label: "Bordô",
    dark: { bg: "#12060a", bgRaised: "#1c0c12", fg: "#f6eff0", accent: "#c07a86", accentStrong: "#d494a0", accentDark: "#995a66" },
    light: { bg: "#faf3f4", bgRaised: "#ffffff", fg: "#2a0f16", accent: "#8a3d4d", accentStrong: "#a35768", accentDark: "#6e2c3a" },
  },
  {
    slug: "grafite",
    label: "Grafite",
    dark: { bg: "#0c0d0f", bgRaised: "#15171a", fg: "#f1f1ef", accent: "#a8a49c", accentStrong: "#c0bcb2", accentDark: "#83807a" },
    light: { bg: "#f3f3f1", bgRaised: "#ffffff", fg: "#17181a", accent: "#5c5850", accentStrong: "#78746a", accentDark: "#454138" },
  },
  {
    slug: "creme",
    label: "Creme",
    dark: { bg: "#1c1814", bgRaised: "#27221c", fg: "#f7f2e9", accent: "#e4d8c3", accentStrong: "#efe6d6", accentDark: "#c4b595" },
    light: { bg: "#fbf8f1", bgRaised: "#ffffff", fg: "#231d14", accent: "#7d6a47", accentStrong: "#a8926e", accentDark: "#655537" },
  },
];

// "champanhe" saiu da lista (Paulo, 18/10: parecida demais com o Creme). Dado antigo com esse nome
// vale como Creme, para nenhuma página perder a cor.
const LEGACY_SLUG_ALIAS: Record<string, ColorThemeSlug> = { champanhe: "creme" };

export function findColorTheme(slug: string | null | undefined): ColorTheme | null {
  const wanted = slug ? (LEGACY_SLUG_ALIAS[slug] ?? slug) : slug;
  return COLOR_THEMES.find((theme) => theme.slug === wanted) ?? null;
}

// Cor da paleta por tipo de imóvel (Admin → Integrações → "Cores por tipo").
// Tipo sem entrada = sem cor própria (segue o padrão do site).
export type TypeColorThemes = Partial<Record<PropertyType, ColorThemeSlug>>;

export const COLOR_THEME_PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "moradia", label: "Moradia" },
  { value: "apartamento", label: "Apartamento" },
  { value: "terreno", label: "Terreno" },
  { value: "outro", label: "Outro" },
];

// Descarta tipo ou paleta desconhecidos (o valor vem de um formulário e do
// banco — nunca confiar). Devolve só entradas válidas.
export function sanitizeTypeColorThemes(raw: unknown): TypeColorThemes {
  const clean: TypeColorThemes = {};
  if (!raw || typeof raw !== "object") return clean;
  const source = raw as Record<string, unknown>;
  for (const { value } of COLOR_THEME_PROPERTY_TYPES) {
    const slug = source[value];
    if (typeof slug === "string" && findColorTheme(slug)) clean[value] = slug as ColorThemeSlug;
  }
  return clean;
}

// Precedência (decidida com o Paulo em 08/10/2026): a paleta escolhida NA FICHA
// do imóvel manda; sem ela vale a do TIPO; sem as duas, o padrão do site.
// Escolher "Terracota" na ficha é uma escolha de verdade: segura o imóvel no
// padrão mesmo que o tipo dele tenha outra cor.
export function resolveColorThemeSlug(
  propertyTheme: string | null | undefined,
  propertyType: PropertyType | null | undefined,
  typeThemes: TypeColorThemes,
): ColorThemeSlug | null {
  const own = findColorTheme(propertyTheme);
  if (own) return own.slug;
  if (propertyType && typeThemes[propertyType]) return typeThemes[propertyType] ?? null;
  return null;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function tokensToVars(t: PaletteTokens, mode: "dark" | "light", band: PaletteTokens): string {
  const borderAlpha = mode === "dark" ? 0.12 : 0.1;
  return [
    `--c-bg:${t.bg}`,
    `--c-bg-raised:${t.bgRaised}`,
    `--c-fg:${t.fg}`,
    `--c-fg-muted:${rgba(t.fg, 0.62)}`,
    `--c-accent:${t.accent}`,
    `--c-accent-strong:${t.accentStrong}`,
    `--c-accent-dark:${t.accentDark}`,
    `--c-border:${rgba(t.fg, borderAlpha)}`,
    // Faixas que ficam escuras nos dois temas (formulário e rodapé das landings
    // de campanha) usam sempre a versão ESCURA da paleta.
    `--c-band-bg:${band.bg}`,
    `--c-band-raised:${band.bgRaised}`,
    `--c-band-fg:${band.fg}`,
    `--c-band-accent:${band.accent}`,
    `--c-band-accent-strong:${band.accentStrong}`,
  ].join(";");
}

// CSS que recolore a página inteira: sobrescreve as variáveis no <html>, então
// fundo do <body>, cartões, texto, bordas, menu, rodapé e janelas (galeria,
// lightbox) leem a paleta juntos. Nulo pra "sem paleta" ou "terracota" (padrão)
// — nesses casos a página não recebe CSS nenhum.
export function paletteCss(slug: string | null | undefined): string | null {
  const theme = findColorTheme(slug);
  if (!theme || theme.slug === "terracota") return null;
  return (
    `html[data-theme="dark"]{${tokensToVars(theme.dark, "dark", theme.dark)}}` +
    `html[data-theme="light"]{${tokensToVars(theme.light, "light", theme.dark)}}`
  );
}

// CSS das paletas para UM card em Super-Destaque (Home e Portfólio): em vez de trocar a
// página inteira (paletteCss), troca só as cores dentro do elemento marcado com
// data-card-palette="<slug>". O tema do Tailwind é `@theme inline` (globals.css): as classes
// leem os --c-* direto, então são eles que se redefinem aqui. Terracota (padrão) não gera CSS.
export function cardPaletteCss(): string {
  const rule = (slug: string, mode: "dark" | "light", t: PaletteTokens) => {
    const alpha = mode === "dark" ? 0.12 : 0.1;
    return (
      `html[data-theme="${mode}"] [data-card-palette="${slug}"]{` +
      `--c-bg-raised:${t.bgRaised};--c-fg:${t.fg};` +
      `--c-fg-muted:${rgba(t.fg, 0.62)};--c-accent:${t.accent};` +
      `--c-accent-strong:${t.accentStrong};--c-border:${rgba(t.fg, alpha)};` +
      `color:${t.fg}}`
    );
  };
  return COLOR_THEMES.filter((theme) => theme.slug !== "terracota")
    .map((theme) => rule(theme.slug, "dark", theme.dark) + rule(theme.slug, "light", theme.light))
    .join("");
}
