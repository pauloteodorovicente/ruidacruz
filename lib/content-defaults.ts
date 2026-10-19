import "server-only";
import type { ContentSourceId } from "@/lib/content-overrides";

const LOCALES = ["pt-PT", "pt-BR", "en", "es", "fr", "it", "de"] as const;
export type ContentLocale = (typeof LOCALES)[number];

export function isContentLocale(value: unknown): value is ContentLocale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

// O texto PADRÃO de cada fonte (o que está escrito em código/catálogo) num idioma. O admin usa isto
// para listar o que pode ser editado e para validar que só se edita o que existe.
export async function loadDefaultContent(source: ContentSourceId, locale: ContentLocale): Promise<unknown> {
  switch (source) {
    case "site":
      return (await import(`../messages/${locale}.json`)).default;
    case "leca":
      return (await import("@/lib/content")).content[locale];
    case "verdelago":
      return (await import("@/lib/verdelago-content")).content[locale];
    case "portimao":
      return (await import("@/lib/portimao-content")).content[locale];
    case "onegreenway":
      return (await import("@/lib/onegreenway-content")).content[locale];
  }
}
