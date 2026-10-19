// Galerias das landings de campanha lidas do banco (property_photos), Admin → editar imóvel → Fotos
// (pedido do Paulo, 19/10/2026: nada de foto fixa no código). Estes tipos e regras valem no servidor e no navegador.

// Foto da galeria de uma landing. `alt` vem de property_photos.alt_text (um texto por idioma); sem ele, cada
// landing usa uma descrição padrão própria.
export type GalleryPhoto = { src: string; alt?: Record<string, string> };

// A grade da galeria mostra as primeiras fotos; a "galeria completa" (visualizador) tem todas. Mesma regra da
// ficha genérica (12), e o número que as landings já mostravam.
export const GALLERY_GRID_COUNT = 12;

const LOCALES = ["pt-PT", "pt-BR", "en", "es", "fr", "it", "de"] as const;

// Garante um `alt` para todo idioma: o da foto, ou o texto padrão da landing.
export function withFallbackAlt(photos: GalleryPhoto[], fallback: (locale: string) => string): (GalleryPhoto & { alt: Record<string, string> })[] {
  const fallbackAlt = Object.fromEntries(LOCALES.map((locale) => [locale, fallback(locale)]));
  return photos.map((photo) => ({ src: photo.src, alt: { ...fallbackAlt, ...(photo.alt ?? {}) } }));
}
