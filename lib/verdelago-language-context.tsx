"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { content, type Locale } from "./verdelago-content";
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
export function VerdelagoLanguageProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const setLocale = useLandingLocaleSwitch();
  const value = useMemo(() => ({ locale, setLocale, t: content[locale] }), [locale, setLocale]);

  return <VerdelagoLanguageContext.Provider value={value}>{children}</VerdelagoLanguageContext.Provider>;
}

export function useVerdelagoLanguage() {
  const ctx = useContext(VerdelagoLanguageContext);
  if (!ctx) throw new Error("useVerdelagoLanguage must be used within VerdelagoLanguageProvider");
  return ctx;
}
