import type { AppLocale } from "@/i18n/routing";

// Todas as landings de campanha (Leça do Balio, Verdelago, Verdelago Fase 6,
// Portimão, One Green Way) vivem dentro de app/[locale] — idioma na URL
// (/onegreenway em português, /en/onegreenway em inglês...), passando pelo
// middleware do next-intl como o resto do site. Exigência do Paulo
// (08/10/2026): toda página do site dentro do sistema de idiomas,
// funcionando perfeitamente nos 7. Página nova = dentro de app/[locale].

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
