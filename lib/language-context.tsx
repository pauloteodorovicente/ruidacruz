"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { content, type Locale } from "./content";

type LanguageContextValue = {
  locale: Locale;
  toggle: () => void;
  t: (typeof content)[Locale];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt");

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored === "pt" || stored === "en") {
      setLocale(stored);
      return;
    }
    const browserLang = navigator.language?.toLowerCase() ?? "";
    if (!browserLang.startsWith("pt")) {
      setLocale("en");
    }
  }, []);

  function toggle() {
    const next: Locale = locale === "pt" ? "en" : "pt";
    setLocale(next);
    localStorage.setItem("locale", next);
  }

  return (
    <LanguageContext.Provider value={{ locale, toggle, t: content[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
