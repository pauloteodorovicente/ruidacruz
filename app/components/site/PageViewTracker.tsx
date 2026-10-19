"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { getAttribution, shouldSkipTracking } from "@/lib/attribution";
import { stripLocale } from "@/lib/analytics-shared";
import { trackEvent } from "@/lib/track-event";

// Conta uma visita por página e por aba (sessionStorage), sem cookies e sem dados pessoais:
// guarda só o caminho (sem o prefixo de idioma), o idioma, a origem (utm ou domínio de
// referência) e nada mais. Não conta robôs nem o visitante interno (lib/attribution.ts).
// Vive no layout público; o /admin tem outro layout e nunca passa por aqui.
export function PageViewTracker() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    if (shouldSkipTracking()) return;
    const path = stripLocale(pathname);
    // Mesma página (inclusive trocando de idioma) conta uma vez por aba.
    const key = `rdc-pv:${path}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      return; // sem armazenamento na aba: não arrisca contar a cada navegação
    }
    // Origem da sessão (utm da primeira página, ou domínio de quem enviou o visitante).
    const attribution = getAttribution();
    trackEvent("page_view", undefined, { path, locale, ...attribution });
  }, [pathname, locale]);

  return null;
}
