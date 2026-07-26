"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { recommendLayoutMode } from "@/lib/property-types";

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
  const { error } = id
    ? await supabase.from("properties").update(record).eq("id", id)
    : await supabase.from("properties").insert(record);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/imoveis/${record.reference}`);
  redirect("/admin");
}
