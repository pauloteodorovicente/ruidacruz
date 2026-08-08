"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { content, type Locale } from "./portimao-content";

type PortimaoLanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof content)[Locale];
};

const PortimaoLanguageContext = createContext<PortimaoLanguageContextValue | null>(null);

const LOCALES: Locale[] = ["pt-PT", "pt-BR", "en", "es", "fr", "it", "de"];

function detectLocale(): Locale {
  const browserLang = navigator.language?.toLowerCase() ?? "";
  if (browserLang.startsWith("pt-br")) return "pt-BR";
  if (browserLang.startsWith("pt")) return "pt-PT";
  const match = LOCALES.find((l) => browserLang.startsWith(l.toLowerCase()));
  return match ?? "en";
}

export function PortimaoLanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt-PT");

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored && LOCALES.includes(stored)) {
      setLocaleState(stored);
      return;
    }
    setLocaleState(detectLocale());
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem("locale", next);
  }

  return (
    <PortimaoLanguageContext.Provider value={{ locale, setLocale, t: content[locale] }}>
      {children}
    </PortimaoLanguageContext.Provider>
  );
}

export function usePortimaoLanguage() {
  const ctx = useContext(PortimaoLanguageContext);
  if (!ctx) throw new Error("usePortimaoLanguage must be used within PortimaoLanguageProvider");
  return ctx;
}
