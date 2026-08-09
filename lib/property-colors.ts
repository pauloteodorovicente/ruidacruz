export type ColorThemeSlug = "terracota" | "musgo" | "marinho" | "bordo" | "grafite" | "champanhe" | "creme";

export type ColorThemeSwatch = {
  slug: ColorThemeSlug;
  label: string;
  dark: string;
  light: string;
};

// Fonte única pros nomes/pré-visualização no admin (ColorThemePicker.tsx) —
// os valores de verdade aplicados no site vivem em app/globals.css, como
// regras CSS (`html[data-theme] [data-color-theme="X"]`). "Terracota" não
// tem regra própria lá porque é matematicamente igual à cor padrão do site
// (--c-accent já é um tom terracota/cobre) — escolhê-la é o mesmo que deixar
// em branco. As outras 6 têm que ser mantidas em sincronia manual com as
// regras em globals.css sempre que um dos dois arquivos mudar.
export const COLOR_THEMES: ColorThemeSwatch[] = [
  { slug: "terracota", label: "Terracota (padrão)", dark: "#ce946e", light: "#a3623a" },
  { slug: "musgo", label: "Musgo", dark: "#8ea67c", light: "#5f7a4e" },
  { slug: "marinho", label: "Marinho", dark: "#7d97c4", light: "#3f5c8a" },
  { slug: "bordo", label: "Bordô", dark: "#c07a86", light: "#8a3d4d" },
  { slug: "grafite", label: "Grafite", dark: "#a8a49c", light: "#5c5850" },
  { slug: "champanhe", label: "Champanhe", dark: "#d4bd8e", light: "#a8894f" },
  { slug: "creme", label: "Creme", dark: "#d8cbb5", light: "#a8926e" },
];
