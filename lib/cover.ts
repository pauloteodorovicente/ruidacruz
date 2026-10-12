import type { PropertyPhoto } from "@/lib/property-types";

// Regra única da capa de um imóvel (Paulo, 09-11/10/2026) — usada nos cards
// da Home/Portfólio, no Hero da ficha, na prévia de link e no admin:
//   1. capa definida no admin (cover_photo_id), se a foto ainda estiver visível;
//   2. senão, a primeira foto visível (menor posição), mesmo sem capa definida;
//   3. senão, nada — quem mostra decide o que fazer (a assinatura do Rui).
// Foto arquivada (visible = false) nunca vale como capa: se a capa definida
// for arquivada, volta a valer a primeira visível.

export function visiblePhotos(photos: PropertyPhoto[]): PropertyPhoto[] {
  return photos.filter((photo) => photo.visible).sort((a, b) => a.position - b.position);
}

export type CoverSource = "explicit" | "auto" | "none";

export function resolveCover(
  photos: PropertyPhoto[],
  coverPhotoId: string | null | undefined,
): { photo: PropertyPhoto | null; source: CoverSource } {
  const visible = visiblePhotos(photos);
  if (coverPhotoId) {
    const explicit = visible.find((photo) => photo.id === coverPhotoId);
    if (explicit) return { photo: explicit, source: "explicit" };
  }
  const first = visible[0] ?? null;
  return { photo: first, source: first ? "auto" : "none" };
}

// Fotos visíveis com a capa na frente e o resto na ordem da galeria — a ordem
// em que o carrossel das capas passa por elas.
export function coverFirstOrder(photos: PropertyPhoto[], coverPhotoId: string | null | undefined): PropertyPhoto[] {
  const visible = visiblePhotos(photos);
  const { photo, source } = resolveCover(photos, coverPhotoId);
  if (!photo || source !== "explicit") return visible;
  return [photo, ...visible.filter((p) => p.id !== photo.id)];
}

// As 4 landings de campanha cujas fotos ainda moram no código (não em
// property_photos) mantêm a capa que sempre tiveram, até alguém definir uma
// capa no admin. Ordem: capa definida > esta > primeira foto visível >
// assinatura. Quando a galeria delas for pro admin (como a da One Green Way
// foi), basta apagar a entrada daqui.
export const LEGACY_COVER_BY_REFERENCE: Record<string, string> = {
  "122481641-38": "/images/leca-do-balio/01-hero-fachada.jpg",
  verdelago: "/images/verdelago/01-hero-humanizada.jpg",
  "portimao-praia-da-rocha": "/images/portimao-praia-rocha/Apart T1 Praia_Rocha_10.jpeg",
  onegreenway: "/images/onegreenway/hero-1.jpg",
};

// ---- Carrossel automático nas capas dos cards (Saída C-3) ----
// Padrão do site (admin: Integrações → Capas dos cards); cada imóvel pode
// sobrescrever com properties.cover_carousel.
export type CardCarouselSettings = {
  enabled: boolean;
  intervalSeconds: number; // tempo de cada foto
  maxPhotos: number; // quantas fotos entram no giro (capa + as seguintes)
};

export const CARD_CAROUSEL_DEFAULTS: CardCarouselSettings = { enabled: true, intervalSeconds: 5, maxPhotos: 5 };
export const CARD_CAROUSEL_LIMITS = {
  intervalSeconds: { min: 2, max: 15 },
  maxPhotos: { min: 2, max: 10 },
} as const;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// Valor vindo do banco pode estar incompleto/fora da faixa — nunca quebra a Home.
export function sanitizeCardCarousel(value: Partial<CardCarouselSettings> | null | undefined): CardCarouselSettings {
  const d = CARD_CAROUSEL_DEFAULTS;
  const L = CARD_CAROUSEL_LIMITS;
  const interval = Number(value?.intervalSeconds);
  const max = Number(value?.maxPhotos);
  return {
    enabled: typeof value?.enabled === "boolean" ? value.enabled : d.enabled,
    intervalSeconds: Number.isFinite(interval) ? clamp(interval, L.intervalSeconds.min, L.intervalSeconds.max) : d.intervalSeconds,
    maxPhotos: Number.isFinite(max) ? clamp(Math.round(max), L.maxPhotos.min, L.maxPhotos.max) : d.maxPhotos,
  };
}

// O que um card precisa pra desenhar a capa: as fotos na ordem (a primeira é a
// capa) e se deve girar. Lista vazia = sem foto nenhuma → assinatura do Rui.
export type CardCover = { photos: string[]; rotate: boolean };
