"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { content, galleryPhotos, type Locale } from "./portimao-content";
import type { GalleryPhoto } from "./landing-gallery-shared";
import { applyOverrides } from "./content-overrides";
import { useLandingLocaleSwitch } from "./use-landing-locale-switch";

type PortimaoLanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof content)[Locale];
  // Fotos da galeria (banco, ordem do admin); sem fotos no banco valem as imagens padrão da landing.
  photos: GalleryPhoto[];
};

// Imagens padrão da galeria (as que a landing sempre teve; o nome do arquivo tem espaço, daí o encode).
const STATIC_PHOTOS: GalleryPhoto[] = galleryPhotos.map((file) => ({ src: `/images/portimao-praia-rocha/${encodeURIComponent(file)}` }));

const PortimaoLanguageContext = createContext<PortimaoLanguageContextValue | null>(null);

// O idioma vem da URL (app/[locale]/portimao-praia-da-rocha) e chega pronto
// do servidor — sem localStorage, sem detecção pelo navegador e sem o "flash"
// em português da versão antiga. Trocar de idioma (setLocale) navega pra mesma
// página no outro idioma.
// overrides: textos editados no admin para este idioma (lib/content-overrides.ts); sem eles vale o padrão.
export function PortimaoLanguageProvider({
  locale,
  overrides,
  photos,
  children,
}: {
  locale: Locale;
  overrides?: Record<string, string>;
  photos?: GalleryPhoto[];
  children: ReactNode;
}) {
  const setLocale = useLandingLocaleSwitch();
  const value = useMemo(
    () => ({ locale, setLocale, t: applyOverrides(content[locale], overrides), photos: photos ?? STATIC_PHOTOS }),
    [locale, setLocale, overrides, photos],
  );

  return <PortimaoLanguageContext.Provider value={value}>{children}</PortimaoLanguageContext.Provider>;
}

export function usePortimaoLanguage() {
  const ctx = useContext(PortimaoLanguageContext);
  if (!ctx) throw new Error("usePortimaoLanguage must be used within PortimaoLanguageProvider");
  return ctx;
}
