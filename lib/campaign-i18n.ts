import type { AppLocale } from "@/i18n/routing";

// Landings de campanha que JÁ vivem dentro de app/[locale] — idioma na URL
// (/onegreenway em português, /en/onegreenway em inglês...), passando pelo
// middleware do next-intl. As que ainda não migraram (Leça, Verdelago,
// Portimão, Verdelago Fase 6) continuam fora de [locale], com idioma
// escolhido no navegador (ver proxy.ts). Cada migração acrescenta o caminho
// aqui; quando a última migrar, esta lista e a exceção em proxy.ts somem.
//
// Exigência do Paulo (08/10/2026): toda página do site dentro do sistema de
// idiomas, funcionando perfeitamente nos 7.
export const LOCALIZED_CAMPAIGN_PATHS: readonly string[] = [
  "/onegreenway",
  "/portimao-praia-da-rocha",
  "/verdelago",
  "/verdelago6",
];

export function isLocalizedCampaignPath(path: string | null | undefined): boolean {
  return Boolean(path && LOCALIZED_CAMPAIGN_PATHS.includes(path));
}

// og:locale por idioma (formato xx_YY que o Open Graph espera).
export const OG_LOCALE: Record<AppLocale, string> = {
  "pt-PT": "pt_PT",
  "pt-BR": "pt_BR",
  en: "en_GB",
  es: "es_ES",
  fr: "fr_FR",
  it: "it_IT",
  de: "de_DE",
};
