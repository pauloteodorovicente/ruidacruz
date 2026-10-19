"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { content, type Locale } from "./verdelago-content";
import { applyOverrides } from "./content-overrides";
import { useLandingLocaleSwitch } from "./use-landing-locale-switch";

type VerdelagoLanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof content)[Locale];
};

const VerdelagoLanguageContext = createContext<VerdelagoLanguageContextValue | null>(null);

// O idioma vem da URL (app/[locale]/verdelago e /verdelago6) e chega pronto do
// servidor — sem localStorage, sem detecção pelo navegador e sem o "flash" em
// português da versão antiga. Trocar de idioma (setLocale) navega pra mesma
// página no outro idioma.
// overrides: textos editados no admin para este idioma (lib/content-overrides.ts); sem eles vale o padrão.
export function VerdelagoLanguageProvider({
  locale,
  overrides,
  children,
}: {
  locale: Locale;
  overrides?: Record<string, string>;
  children: ReactNode;
}) {
  const setLocale = useLandingLocaleSwitch();
  const value = useMemo(() => ({ locale, setLocale, t: applyOverrides(content[locale], overrides) }), [locale, setLocale, overrides]);

  return <VerdelagoLanguageContext.Provider value={value}>{children}</VerdelagoLanguageContext.Provider>;
}

export function useVerdelagoLanguage() {
  const ctx = useContext(VerdelagoLanguageContext);
  if (!ctx) throw new Error("useVerdelagoLanguage must be used within VerdelagoLanguageProvider");
  return ctx;
}
