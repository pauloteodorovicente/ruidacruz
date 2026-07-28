"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { HeroItem, HeroLayout, HeroMediaType } from "@/lib/home-hero";

const BUCKET = "hero-media";

export async function saveHomeHero(mediaType: HeroMediaType, layout: HeroLayout, items: HeroItem[]) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: existing } = await supabase.from("home_hero").select("id").limit(1).maybeSingle();

  const record = { media_type: mediaType, layout, items, updated_at: new Date().toISOString() };
  const { error } = existing
    ? await supabase.from("home_hero").update(record).eq("id", existing.id)
    : await supabase.from("home_hero").insert(record);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/hero");
}

// Upload direto do computador (imagem ou vídeo) — vira um item selecionável
// de imediato, sem estar vinculado a nenhum imóvel.
export async function uploadHeroMedia(formData: FormData): Promise<string> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Nenhum arquivo enviado.");

  const supabase = createAdminClient();
  const path = `uploads/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
