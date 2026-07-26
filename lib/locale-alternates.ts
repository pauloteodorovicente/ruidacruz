import { routing } from "@/i18n/routing";

const BASE_URL = "https://ruidacruzconsultor.com";

// Gera o mapa alternates.languages (hreflang) do Next.js pra uma rota do
// site institucional — mesma regra de prefixo do middleware (pt-PT sem
// prefixo, os outros 6 com /xx), repetida aqui por rodar fora do contexto
// de request do next-intl (generateMetadata roda antes do meio-termo).
export function localeAlternates(path: string): Record<string, string> {
  const entries = routing.locales.map((locale) => {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    return [locale, `${BASE_URL}${prefix}${path}`] as const;
  });
  return Object.fromEntries([...entries, ["x-default", `${BASE_URL}${path}`]]);
}
