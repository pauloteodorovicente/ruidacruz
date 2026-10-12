"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

// Troca de idioma das landings de campanha que já vivem em app/[locale]
// (idioma na URL: /verdelago em português, /en/verdelago em inglês...). Em vez
// de guardar a escolha em localStorage e trocar o texto depois da hidratação
// (como as landings antigas faziam), navega pra mesma página no outro idioma —
// o servidor já devolve o HTML traduzido, que é o que o Google e quem chega por
// um link em outro idioma enxergam. scroll:false pra não mexer um milímetro na
// página; só re-renderiza o texto no lugar (mesmo comportamento do
// LanguageSwitcher do site institucional).
export function useLandingLocaleSwitch(): (next: AppLocale) => void {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (next: AppLocale) => {
      router.replace(pathname, { locale: next, scroll: false });
    },
    [router, pathname],
  );
}
