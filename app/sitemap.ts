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

  const institutionalPaths = ["", "/sobre", "/contacto"];
  const institutionalEntries: MetadataRoute.Sitemap = institutionalPaths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localizedPath(locale, path),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
    })),
  );

  const propertyEntries: MetadataRoute.Sitemap = properties.flatMap((property) =>
    routing.locales.map((locale) => ({
      url: localizedPath(locale, `/imoveis/${property.reference}`),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  );

  return [
    ...institutionalEntries,
    ...propertyEntries,
    { url: `${BASE_URL}/leca-do-balio`, changeFrequency: "weekly", priority: 0.9 },
  ];
}
