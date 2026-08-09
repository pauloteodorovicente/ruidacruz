"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { recommendLayoutMode } from "@/lib/property-types";
import { translatePropertyToAllLocales } from "@/lib/translate-property";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function numOrNull(formData: FormData, key: string): number | null {
  const value = str(formData, key);
  return value ? Number(value) : null;
}

export async function saveProperty(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = str(formData, "id");
  const propertyType = str(formData, "property_type") as "moradia" | "apartamento" | "terreno" | "outro";
  const architect = str(formData, "architect") || null;
  const layoutMode = str(formData, "layout_mode");
  const recommended = recommendLayoutMode({ property_type: propertyType, architect });

  const highlights = str(formData, "highlights")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const record = {
    reference: str(formData, "reference"),
    title: str(formData, "title"),
    property_type: propertyType,
    typology: str(formData, "typology") || null,
    status: str(formData, "status") || "disponivel",
    business_type: str(formData, "business_type") || "venda",
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    zone: str(formData, "zone") || null,
    municipality: str(formData, "municipality") || null,
    map_url: str(formData, "map_url") || null,
    price: numOrNull(formData, "price"),
    price_on_application: formData.get("price_on_application") === "on",
    land_area_sqm: numOrNull(formData, "land_area_sqm"),
    construction_area_sqm: numOrNull(formData, "construction_area_sqm"),
    parking: str(formData, "parking") || null,
    construction_year: numOrNull(formData, "construction_year"),
    energy_certificate: str(formData, "energy_certificate") || null,
    description: str(formData, "description") || null,
    highlights,
    architect,
    landscaper: str(formData, "landscaper") || null,
    layout_mode: layoutMode || recommended,
    layout_mode_overridden: layoutMode !== recommended,
  };

  if (!record.reference || !record.title) {
    throw new Error("Referência e título são obrigatórios.");
  }

  const supabase = createAdminClient();
  const { data: saved, error } = id
    ? await supabase.from("properties").update(record).eq("id", id).select("id").single()
    : await supabase.from("properties").insert(record).select("id").single();

  if (error) throw new Error(error.message);

  // Traduzir pros outros 6 idiomas só quando publicado (rascunho não é visto
  // por ninguém ainda) — roda depois da resposta (after), nunca bloqueia o
  // fluxo de publicar: se o DeepL demorar ou falhar, publicar já terminou.
  if (record.published) {
    after(() =>
      translatePropertyToAllLocales(saved.id, {
        title: record.title,
        description: record.description,
        highlights: record.highlights,
      }),
    );
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/imoveis/${record.reference}`);
  redirect("/admin");
}

// Cópia rápida pra imóveis que compartilham estrutura/zona — nasce sempre em
// rascunho, sem fotos/plantas (ficam pro imóvel original; evita duplicar
// arquivos do Storage sem necessidade real). Referência nova, gerada aqui,
// nunca reaproveitada.
export async function duplicateProperty(id: string) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: original, error: fetchError } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { id: _id, created_at: _createdAt, updated_at: _updatedAt, reference, title, ...rest } = original;
  void _id;
  void _createdAt;
  void _updatedAt;

  let newReference = `${reference}-copia`;
  const { data: clash } = await supabase.from("properties").select("id").eq("reference", newReference).maybeSingle();
  if (clash) newReference = `${reference}-copia-${Date.now().toString(36)}`;

  const { data: copy, error } = await supabase
    .from("properties")
    .insert({
      ...rest,
      reference: newReference,
      title: `${title} (cópia)`,
      published: false,
      featured: false,
    })
    .select("reference")
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  redirect(`/admin/imoveis/${copy.reference}/editar`);
}
