"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { content, type Locale } from "./onegreenway-content";

type OneGreenwayLanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof content)[Locale];
};

const OneGreenwayLanguageContext = createContext<OneGreenwayLanguageContextValue | null>(null);

const LOCALES: Locale[] = ["pt-PT", "pt-BR", "en", "es", "fr", "it", "de"];

function detectLocale(): Locale {
  const browserLang = navigator.language?.toLowerCase() ?? "";
  if (browserLang.startsWith("pt-br")) return "pt-BR";
  if (browserLang.startsWith("pt")) return "pt-PT";
  const match = LOCALES.find((l) => browserLang.startsWith(l.toLowerCase()));
  return match ?? "en";
}

export function OneGreenwayLanguageProvider({ children }: { children: ReactNode }) {
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
    <OneGreenwayLanguageContext.Provider value={{ locale, setLocale, t: content[locale] }}>
      {children}
    </OneGreenwayLanguageContext.Provider>
  );
}

export function useOneGreenwayLanguage() {
  const ctx = useContext(OneGreenwayLanguageContext);
  if (!ctx) throw new Error("useOneGreenwayLanguage must be used within OneGreenwayLanguageProvider");
  return ctx;
}
