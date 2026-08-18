import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProperties } from "@/lib/properties";

const BASE_URL = "https://ruidacruzconsultor.com";

// "as-needed": o locale padrão (pt-PT) não leva prefixo na URL, os outros 6
// levam — mesma regra do middleware (i18n/routing.ts), replicada aqui porque
// o sitemap roda fora do contexto de request do next-intl.
function localizedPath(locale: string, path: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${BASE_URL}${prefix}${path}`;
}

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

  // Landings de campanha (Leça, Verdelago, Portimão, One Green Way) vivem
  // fora da árvore [locale] — path fixo, sem locale nem tradução, ao
  // contrário do template genérico. Achado corrigindo esta fase: elas
  // também apareciam na lista de baixo com a URL errada (/imoveis/{ref}, que
  // não é onde a página de verdade está), e só a Leça tinha entrada própria
  // — as outras 3 nunca apareceram no sitemap até agora.
  const propertyEntries: MetadataRoute.Sitemap = properties
    .filter((property) => !property.is_campaign_page)
    .flatMap((property) =>
      routing.locales.map((locale) => ({
        url: localizedPath(locale, `/imoveis/${property.reference}`),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      })),
    );

  const campaignEntries: MetadataRoute.Sitemap = properties
    .filter((property) => property.is_campaign_page && property.campaign_path)
    .map((property) => ({
      url: `${BASE_URL}${property.campaign_path}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

  return [...institutionalEntries, ...propertyEntries, ...campaignEntries];
}
