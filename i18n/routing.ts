import { defineRouting } from "next-intl/routing";

// pt-PT é o idioma fonte (todo conteúdo é escrito nele primeiro) e o default
// sem prefixo na URL — /sobre, não /pt-PT/sobre. Os outros 6 ganham prefixo
// (/en/sobre, /es/sobre...). Mantém a mesma lista de 7 locales já usada no
// schema do banco (lib/property-types.ts) pras traduções de imóveis.
export const routing = defineRouting({
  locales: ["pt-PT", "pt-BR", "en", "es", "fr", "it", "de"],
  defaultLocale: "pt-PT",
  localePrefix: "as-needed",
  // Desligado de propósito: com localeDetection ligado (padrão), toda visita
  // à raiz "/" cujo Accept-Language não seja exatamente pt-PT sofre um
  // redirect HTTP real pro locale prefixado antes da página carregar — medido
  // em Lighthouse como ~830-940ms de custo direto em LCP/FCP, derrubando o
  // score de performance de >90 pra 61. Sem detecção automática, "/" sempre
  // serve pt-PT direto (zero redirect); o visitante troca de idioma pelo
  // seletor, que já navega pra URL certa e lembra a escolha via cookie.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
