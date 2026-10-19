"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

// Chave gravada na primeira visita (e quando o visitante troca de idioma à mão): daí em diante a
// escolha dele vale e nada é trocado sozinho.
export const LANDING_LANG_KEY = "landing-lang-chosen";

// Idioma do navegador → um dos 7 idiomas do site (nulo = não suportado, fica como está).
function pickLocale(languages: readonly string[]): AppLocale | null {
  for (const raw of languages) {
    const tag = raw.toLowerCase();
    if (tag === "pt-br") return "pt-BR";
    if (tag.startsWith("pt")) return "pt-PT";
    const base = tag.split("-")[0];
    const match = routing.locales.find((locale) => locale.toLowerCase() === base);
    if (match) return match;
  }
  return null;
}

// Landings de campanha seguem o idioma do navegador do visitante na PRIMEIRA visita (pedido do
// Paulo, 18/10: "esse deve ser o padrão"). Só age em quem chega pelo endereço em português
// (sem prefixo): um link /en/... ou /de/... é uma escolha explícita e vale como está. A troca é
// uma navegação suave para o mesmo endereço no outro idioma, sem recarregar a página e sem
// mexer na rolagem. Depois da primeira visita, ou de uma troca manual, nada muda sozinho.
export function LandingLanguageAutoDetect() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    try {
      if (localStorage.getItem(LANDING_LANG_KEY)) return;
      localStorage.setItem(LANDING_LANG_KEY, "1");
    } catch {
      return; // sem armazenamento (janela privada): não arrisca ficar trocando a cada visita
    }
    if (locale !== routing.defaultLocale) return;
    const target = pickLocale(navigator.languages?.length ? navigator.languages : [navigator.language]);
    if (target && target !== locale) {
      // Preserva ?utm_... e #âncora: o link do e-mail da campanha traz a origem na URL.
      router.replace(`${pathname}${window.location.search}${window.location.hash}`, { locale: target, scroll: false });
    }
  }, [locale, pathname, router]);

  return null;
}
