"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { content, type Locale } from "./onegreenway-content";
import { useLandingLocaleSwitch } from "./use-landing-locale-switch";

type OneGreenwayLanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof content)[Locale];
};

const OneGreenwayLanguageContext = createContext<OneGreenwayLanguageContextValue | null>(null);

// O idioma vem da URL (app/[locale]/onegreenway) e chega pronto do servidor —
// sem localStorage, sem detecção pelo navegador e sem o "flash" em português
// que a versão antiga mostrava antes de trocar depois da hidratação. Trocar
// de idioma (setLocale) navega pra mesma página no outro idioma.
export function OneGreenwayLanguageProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const setLocale = useLandingLocaleSwitch();
  const value = useMemo(() => ({ locale, setLocale, t: content[locale] }), [locale, setLocale]);

  return <OneGreenwayLanguageContext.Provider value={value}>{children}</OneGreenwayLanguageContext.Provider>;
}

export function useOneGreenwayLanguage() {
  const ctx = useContext(OneGreenwayLanguageContext);
  if (!ctx) throw new Error("useOneGreenwayLanguage must be used within OneGreenwayLanguageProvider");
  return ctx;
}
