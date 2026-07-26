import { defineRouting } from "next-intl/routing";

// pt-PT é o idioma fonte (todo conteúdo é escrito nele primeiro) e o default
// sem prefixo na URL — /sobre, não /pt-PT/sobre. Os outros 6 ganham prefixo
// (/en/sobre, /es/sobre...). Mantém a mesma lista de 7 locales já usada no
// schema do banco (lib/property-types.ts) pras traduções de imóveis.
export const routing = defineRouting({
  locales: ["pt-PT", "pt-BR", "en", "es", "fr", "it", "de"],
  defaultLocale: "pt-PT",
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];
