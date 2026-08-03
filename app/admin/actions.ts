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

// Landings de campanha (Leça do Balio, Verdelago): conteúdo rico vive no
// código, não neste registo — só título/zona/preço (usados no card da Home)
// e published (controla se a página fica no ar) são editáveis aqui.
export async function saveCampaignPage(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = str(formData, "id");
  const campaignPath = str(formData, "campaign_path");
  if (!id || !campaignPath) throw new Error("Registo de campanha inválido.");

  const record = {
    title: str(formData, "title"),
    zone: str(formData, "zone") || null,
    price: numOrNull(formData, "price"),
    price_on_application: formData.get("price_on_application") === "on",
    published: formData.get("published") === "on",
  };

  if (!record.title) throw new Error("Título é obrigatório.");

  const supabase = createAdminClient();
  const { error } = await supabase.from("properties").update(record).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(campaignPath);
  redirect("/admin");
}
