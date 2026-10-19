import { getProperties, getPropertyTranslation } from "@/lib/properties";
import { localizeProperty } from "@/lib/property-types";
import type { Property, Locale } from "@/lib/property-types";

// Setas para o imóvel anterior e o próximo, em TODAS as páginas de imóvel (a ficha genérica e as cinco
// landings de campanha). A ordem é a da lista pública (mesma do /portfolio) e dá a volta sem fim.
// Cada seta traz o nome do vizinho (no idioma da página). A cor da seta é a da PRÓPRIA página onde ela
// está (pedido do Paulo, 19/10), e vem do CSS da página, não daqui.
export type NeighborArrow = {
  href: string;
  title: string;
};

export type NeighborArrows = { prev: NeighborArrow; next: NeighborArrow };

function hrefFor(property: Property, locale: string): string {
  const prefix = locale === "pt-PT" ? "" : `/${locale}`;
  if (property.is_campaign_page && property.campaign_path) return `${prefix}${property.campaign_path}`;
  const segment = property.slug ?? property.reference;
  return `${prefix}/imoveis/${segment}`;
}

async function toArrow(property: Property, locale: string): Promise<NeighborArrow> {
  const translation =
    locale === property.source_locale ? null : await getPropertyTranslation(property.id, locale as Locale);
  return {
    href: hrefFor(property, locale),
    title: localizeProperty(property, translation).title,
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
  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];
  const [prevArrow, nextArrow] = await Promise.all([toArrow(prev, locale), toArrow(next, locale)]);
  return { prev: prevArrow, next: nextArrow };
}
