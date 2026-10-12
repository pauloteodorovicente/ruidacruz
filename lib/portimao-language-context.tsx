"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { content, type Locale } from "./portimao-content";
import { useLandingLocaleSwitch } from "./use-landing-locale-switch";

type PortimaoLanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof content)[Locale];
};

const PortimaoLanguageContext = createContext<PortimaoLanguageContextValue | null>(null);

// O idioma vem da URL (app/[locale]/portimao-praia-da-rocha) e chega pronto
// do servidor — sem localStorage, sem detecção pelo navegador e sem o "flash"
// em português da versão antiga. Trocar de idioma (setLocale) navega pra mesma
// página no outro idioma.
export function PortimaoLanguageProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const setLocale = useLandingLocaleSwitch();
  const value = useMemo(() => ({ locale, setLocale, t: content[locale] }), [locale, setLocale]);

  return <PortimaoLanguageContext.Provider value={value}>{children}</PortimaoLanguageContext.Provider>;
}

export function usePortimaoLanguage() {
  const ctx = useContext(PortimaoLanguageContext);
  if (!ctx) throw new Error("usePortimaoLanguage must be used within PortimaoLanguageProvider");
  return ctx;
}
