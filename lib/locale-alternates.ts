import { routing } from "@/i18n/routing";

const BASE_URL = "https://ruidacruzconsultor.com";

// URL absoluta de uma rota num idioma — mesma regra de prefixo do middleware
// (pt-PT sem prefixo, os outros 6 com /xx). Repetida aqui por rodar fora do
// contexto de request do next-intl (generateMetadata e sitemap rodam antes do
// meio-termo).
export function localizedUrl(locale: string, path: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${BASE_URL}${prefix}${path}`;
}

// Gera o mapa alternates.languages (hreflang) do Next.js pra uma rota do
// site — as 7 versões + x-default (a versão sem prefixo).
export function localeAlternates(path: string): Record<string, string> {
  const entries = routing.locales.map((locale) => [locale, localizedUrl(locale, path)] as const);
  return Object.fromEntries([...entries, ["x-default", `${BASE_URL}${path}`]]);
}
