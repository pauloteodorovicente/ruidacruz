import { getPropertyPhotos } from "@/lib/properties";
import type { GalleryPhoto } from "@/lib/landing-gallery-shared";

export type { GalleryPhoto } from "@/lib/landing-gallery-shared";

// Fotos visíveis (só imagens) de um imóvel, na ordem do admin, no formato das galerias das landings.
// Sem nenhuma foto no banco devolve undefined e a landing usa as imagens padrão que já tinha.
export async function getLandingPhotos(propertyId: string): Promise<GalleryPhoto[] | undefined> {
  const photos = (await getPropertyPhotos(propertyId)).filter((photo) => photo.visible && photo.media_type !== "video");
  if (photos.length === 0) return undefined;
  return photos.map((photo) => ({ src: photo.storage_path, ...(photo.alt_text ? { alt: photo.alt_text } : {}) }));
}
