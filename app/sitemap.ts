import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProperties } from "@/lib/properties";
import { propertyPathSegment } from "@/lib/property-types";
import { localizedUrl as localizedPath } from "@/lib/locale-alternates";
import { getSellerCtaSettings } from "@/lib/settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties();

  // /vender some do site (404) quando o botão "Vender" está desligado no admin
  // — então só entra no sitemap enquanto estiver ligado.
  const { enabled: sellerCtaEnabled } = await getSellerCtaSettings();
  const institutionalPaths = [
    "",
    "/sobre",
    "/contacto",
    "/portfolio",
    "/guia-comprador-estrangeiro",
    "/faq",
    ...(sellerCtaEnabled ? ["/vender"] : []),
  ];
  const institutionalEntries: MetadataRoute.Sitemap = institutionalPaths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localizedPath(locale, path),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
    })),
  );

  // Landings de campanha (Leça, Verdelago, Verdelago Fase 6, Portimão, One
  // Green Way): vivem em app/[locale], então entram uma vez por idioma, como
  // o resto do site. Ficam fora da lista de baixo (/imoveis/{ref} não é onde
  // a página de verdade está).
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
    .flatMap((property) =>
      routing.locales.map((locale) => ({
        url: localizedPath(locale, property.campaign_path as string),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      })),
    );

  return [...institutionalEntries, ...propertyEntries, ...campaignEntries];
}
