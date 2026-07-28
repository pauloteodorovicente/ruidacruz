import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type GalleryPhoto = {
  id: string;
  storage_path: string;
  property_reference: string;
  property_title: string;
};

// Todas as fotos de todos os imóveis — publicados ou não — pro seletor de
// mídia do Hero da Home. Usa a chave de serviço de propósito: o Hero pode
// querer usar a foto de um imóvel ainda em rascunho antes de ele ser
// publicado (ex. preparar a Home antes de soltar o imóvel pro público).
export async function getAllPropertyPhotosForGallery(): Promise<GalleryPhoto[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("property_photos")
    .select("id, storage_path, position, properties!inner(reference, title)")
    .order("position", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => {
    const property = Array.isArray(row.properties) ? row.properties[0] : row.properties;
    return {
      id: row.id,
      storage_path: row.storage_path,
      property_reference: property?.reference ?? "",
      property_title: property?.title ?? "",
    };
  });
}
