import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProperties } from "@/lib/properties";
import { propertyPathSegment } from "@/lib/property-types";
import { localizedUrl as localizedPath } from "@/lib/locale-alternates";
import { isLocalizedCampaignPath } from "@/lib/campaign-i18n";

const BASE_URL = "https://ruidacruzconsultor.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties();

  const institutionalPaths = ["", "/sobre", "/contacto", "/portfolio", "/guia-comprador-estrangeiro", "/faq"];
  const institutionalEntries: MetadataRoute.Sitemap = institutionalPaths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localizedPath(locale, path),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
    })),
  );

  // Landings de campanha: as que já migraram pra app/[locale] (ver
  // lib/campaign-i18n.ts) entram uma vez por idioma, como o resto do site; as
  // que ainda estão fora da árvore [locale] seguem com path fixo, sem idioma.
  // Elas ficam fora da lista de baixo (/imoveis/{ref} não é onde a página de
  // verdade está).
  const propertyEntries: MetadataRoute.Sitemap = properties
    .filter((property) => !property.is_campaign_page)
    .flatMap((property) =>
      routing.locales.map((locale) => ({
        url: localizedPath(locale, `/imoveis/${propertyPathSegment(property)}`),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      })),
    );

  const campaignEntries: MetadataRoute.Sitemap = properties
    .filter((property) => property.is_campaign_page && property.campaign_path)
    .flatMap((property) => {
      const path = property.campaign_path as string;
      const urls = isLocalizedCampaignPath(path)
        ? routing.locales.map((locale) => localizedPath(locale, path))
        : [`${BASE_URL}${path}`];
      return urls.map((url) => ({ url, changeFrequency: "weekly" as const, priority: 0.9 }));
    });

  return [...institutionalEntries, ...propertyEntries, ...campaignEntries];
}
