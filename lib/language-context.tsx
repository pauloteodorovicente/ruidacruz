"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { content, type Locale } from "./content";
import { applyOverrides } from "./content-overrides";
import { useLandingLocaleSwitch } from "./use-landing-locale-switch";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof content)[Locale];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Contexto de idioma da landing da Leça do Balio (app/[locale]/leca-do-balio).
// O idioma vem da URL e chega pronto do servidor — sem localStorage, sem
// detecção pelo navegador e sem o "flash" em português da versão antiga.
// Trocar de idioma (setLocale) navega pra mesma página no outro idioma.
// overrides: textos editados no admin para este idioma (lib/content-overrides.ts); sem eles vale o padrão.
export function LanguageProvider({
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

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
