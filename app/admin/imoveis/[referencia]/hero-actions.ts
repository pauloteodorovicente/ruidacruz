"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { HeroItem, HeroLayout, HeroMediaType } from "@/lib/property-hero-types";

export async function savePropertyHero(
  propertyId: string,
  propertyReference: string,
  mediaType: HeroMediaType,
  layout: HeroLayout,
  items: HeroItem[]
) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("property_hero")
    .select("id")
    .eq("property_id", propertyId)
    .maybeSingle();

  const record = {
    property_id: propertyId,
    media_type: mediaType,
    layout,
    items,
    updated_at: new Date().toISOString(),
  };
  const { error } = existing
    ? await supabase.from("property_hero").update(record).eq("id", existing.id)
    : await supabase.from("property_hero").insert(record);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(`/imoveis/${propertyReference}`);
  revalidatePath(`/admin/imoveis/${propertyReference}/hero`);
}
