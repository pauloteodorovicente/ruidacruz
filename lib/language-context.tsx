"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { content, galleryImages, type Locale } from "./content";
import { fullGalleryImages } from "./full-gallery";
import { withFallbackAlt, type GalleryPhoto } from "./landing-gallery-shared";
import { applyOverrides } from "./content-overrides";
import { useLandingLocaleSwitch } from "./use-landing-locale-switch";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof content)[Locale];
  // Fotos da galeria (banco, ordem do admin); sem fotos no banco valem as imagens padrão da landing.
  photos: (GalleryPhoto & { alt: Record<string, string> })[];
};

// Imagens padrão (as que a landing sempre teve): a grade curada e as demais da galeria completa.
const STATIC_PHOTOS: GalleryPhoto[] = [
  ...galleryImages.map((image) => ({ src: image.src, alt: image.alt as Record<string, string> })),
  ...fullGalleryImages.map((src) => ({ src })),
];

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Contexto de idioma da landing da Leça do Balio (app/[locale]/leca-do-balio).
// O idioma vem da URL e chega pronto do servidor — sem localStorage, sem
// detecção pelo navegador e sem o "flash" em português da versão antiga.
// Trocar de idioma (setLocale) navega pra mesma página no outro idioma.
// overrides: textos editados no admin para este idioma (lib/content-overrides.ts); sem eles vale o padrão.
export function LanguageProvider({
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
    () => ({ locale, setLocale, t: applyOverrides(content[locale], overrides), photos: withFallbackAlt(photos ?? STATIC_PHOTOS, (l) => content[l as Locale].breadcrumb) }),
    [locale, setLocale, overrides, photos],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
