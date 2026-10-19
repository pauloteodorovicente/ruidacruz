"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { content, galleryImages, type Locale } from "./verdelago-content";
import { withFallbackAlt, type GalleryPhoto } from "./landing-gallery-shared";
import { applyOverrides } from "./content-overrides";
import { useLandingLocaleSwitch } from "./use-landing-locale-switch";

type VerdelagoLanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof content)[Locale];
  // Fotos da galeria (banco, ordem do admin); sem fotos no banco valem as imagens padrão da landing.
  photos: (GalleryPhoto & { alt: Record<string, string> })[];
};

// Imagens padrão da galeria (as que a landing sempre teve).
const STATIC_PHOTOS: GalleryPhoto[] = galleryImages.map((image) => ({ src: image.src, alt: image.alt as Record<string, string> }));

const VerdelagoLanguageContext = createContext<VerdelagoLanguageContextValue | null>(null);

// O idioma vem da URL (app/[locale]/verdelago e /verdelago6) e chega pronto do
// servidor — sem localStorage, sem detecção pelo navegador e sem o "flash" em
// português da versão antiga. Trocar de idioma (setLocale) navega pra mesma
// página no outro idioma.
// overrides: textos editados no admin para este idioma (lib/content-overrides.ts); sem eles vale o padrão.
export function VerdelagoLanguageProvider({
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
    () => ({
      locale,
      setLocale,
      t: applyOverrides(content[locale], overrides),
      photos: withFallbackAlt(photos ?? STATIC_PHOTOS, () => "Verdelago Resort"),
    }),
    [locale, setLocale, overrides, photos],
  );

  return <VerdelagoLanguageContext.Provider value={value}>{children}</VerdelagoLanguageContext.Provider>;
}

export function useVerdelagoLanguage() {
  const ctx = useContext(VerdelagoLanguageContext);
  if (!ctx) throw new Error("useVerdelagoLanguage must be used within VerdelagoLanguageProvider");
  return ctx;
}
