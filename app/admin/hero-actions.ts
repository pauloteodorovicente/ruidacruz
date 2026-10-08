"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { HeroItem, HeroLayout, HeroMediaType, HeroCtaSettings } from "@/lib/home-hero";
import { isValidHeroHref } from "@/lib/home-hero-types";

const BUCKET = "hero-media";

// Destino dos 2 botões abaixo do Hero da Home. Fica em `settings`
// (chave home_hero_cta), separado do home_hero: guardar a mídia do Hero nunca
// mexe nos botões e vice-versa, e não precisa de migração (a Home antiga
// simplesmente ignora a chave nova).
export async function saveHomeHeroCta(settings: HeroCtaSettings): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const primary = settings.primary.trim();
  const secondary = settings.secondary.trim();
  if (!isValidHeroHref(primary) || !isValidHeroHref(secondary)) {
    return {
      ok: false,
      error:
        "Endereço inválido. Use um caminho do site (ex.: /contacto), um link https://… , mailto: ou tel:.",
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("settings")
    .upsert(
      { key: "home_hero_cta", value: { primary, secondary }, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );
  if (error) return { ok: false, error: error.message };

  // "layout" porque a Home existe em 7 idiomas (/, /en, /es...) — revalidar
  // só "/" não garantiria os outros 6.
  revalidatePath("/", "layout");
  revalidatePath("/admin/hero");
  return { ok: true };
}

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
