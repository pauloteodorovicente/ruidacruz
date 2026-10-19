import { getProperties, getPropertyTranslation } from "@/lib/properties";
import { localizeProperty } from "@/lib/property-types";
import type { Property, Locale } from "@/lib/property-types";
import { findColorTheme, resolveColorThemeSlug } from "@/lib/property-colors";
import { getTypeColorThemes } from "@/lib/settings";

// Setas para o imóvel anterior e o próximo, em TODAS as páginas de imóvel (a ficha genérica e as cinco
// landings de campanha). A ordem é a da lista pública (mesma do /portfolio) e dá a volta sem fim.
// Cada seta traz o nome do vizinho (no idioma da página) e a cor de destaque da página DELE nos dois
// temas, porque a seta se pinta com a cor do próximo imóvel (pedido do Paulo, 19/10).
export type NeighborArrow = {
  href: string;
  title: string;
  accentDark: string;
  accentLight: string;
};

export type NeighborArrows = { prev: NeighborArrow; next: NeighborArrow };

function hrefFor(property: Property, locale: string): string {
  const prefix = locale === "pt-PT" ? "" : `/${locale}`;
  if (property.is_campaign_page && property.campaign_path) return `${prefix}${property.campaign_path}`;
  const segment = property.slug ?? property.reference;
  return `${prefix}/imoveis/${segment}`;
}

async function toArrow(
  property: Property,
  locale: string,
  typeThemes: Awaited<ReturnType<typeof getTypeColorThemes>>,
): Promise<NeighborArrow> {
  // Landing só muda de cor se a própria ficha tiver paleta (a cor por tipo não vale para ela);
  // as demais seguem ficha > tipo > padrão, igual à página do vizinho.
  const slug = property.is_campaign_page
    ? (findColorTheme(property.color_theme)?.slug ?? null)
    : resolveColorThemeSlug(property.color_theme, property.property_type, typeThemes);
  const theme = findColorTheme(slug) ?? findColorTheme("terracota")!;
  const translation =
    locale === property.source_locale ? null : await getPropertyTranslation(property.id, locale as Locale);
  return {
    href: hrefFor(property, locale),
    title: localizeProperty(property, translation).title,
    accentDark: theme.dark.accent,
    accentLight: theme.light.accent,
  };
}

// Quem chama com a lista já buscada passa `properties`; senão ela é buscada aqui.
export async function getNeighborArrows(
  currentId: string,
  locale: string,
  properties?: Property[],
): Promise<NeighborArrows | null> {
  const list = properties ?? (await getProperties());
  const index = list.findIndex((item) => item.id === currentId);
  // Some sozinha se o imóvel não está na lista pública (rascunho em pré-visualização) ou se não há outro.
  if (index === -1 || list.length < 2) return null;
  const typeThemes = await getTypeColorThemes();
  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];
  const [prevArrow, nextArrow] = await Promise.all([toArrow(prev, locale, typeThemes), toArrow(next, locale, typeThemes)]);
  return { prev: prevArrow, next: nextArrow };
}
