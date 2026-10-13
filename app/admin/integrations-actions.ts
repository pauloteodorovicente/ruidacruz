"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeCardCarousel } from "@/lib/cover";
import type { CardCarouselSettings } from "@/lib/cover";
import { sanitizeTypeColorThemes } from "@/lib/property-colors";
import type { TypeColorThemes } from "@/lib/property-colors";
import type {
  MetaPixelSettings,
  GhlSettings,
  SchedulingSettings,
  HomeCollectionSettings,
  SellerCtaSettings,
  GrainSettings,
} from "@/lib/settings";

async function upsertSetting(key: string, value: unknown) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(error.message);
}

export async function saveMetaPixelSettings(settings: MetaPixelSettings) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  await upsertSetting("meta_pixel", settings);

  revalidatePath("/admin/integracoes");
  revalidatePath("/", "layout");
  redirect("/admin/integracoes");
}

export async function saveGhlSettings(settings: GhlSettings) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  await upsertSetting("ghl", settings);

  revalidatePath("/admin/integracoes");
  redirect("/admin/integracoes");
}

export async function saveSchedulingSettings(settings: SchedulingSettings) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  await upsertSetting("scheduling", settings);

  revalidatePath("/admin/integracoes");
  revalidatePath("/", "layout");
  redirect("/admin/integracoes");
}

export async function saveHomeCollectionSettings(settings: HomeCollectionSettings) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  await upsertSetting("home_collection", settings);

  revalidatePath("/admin/integracoes");
  revalidatePath("/", "layout");
  redirect("/admin/integracoes");
}

// Guarda o padrão do carrossel das capas. Sem redirect: o formulário mantém o
// estado e mostra "Guardado". Valores são ajustados à faixa permitida no servidor.
export async function saveCardCarouselSettings(
  settings: CardCarouselSettings,
): Promise<{ ok: true; settings: CardCarouselSettings }> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const clean = sanitizeCardCarousel(settings);
  await upsertSetting("card_carousel", clean);

  revalidatePath("/admin/integracoes");
  revalidatePath("/", "layout");
  return { ok: true, settings: clean };
}

// Guarda a paleta de cor de cada tipo de imóvel. Tipo ou paleta desconhecidos
// são descartados no servidor; tipo sem paleta simplesmente fica de fora.
export async function saveTypeColorThemes(
  themes: TypeColorThemes,
): Promise<{ ok: true; themes: TypeColorThemes }> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const clean = sanitizeTypeColorThemes(themes);
  await upsertSetting("type_color_themes", clean);

  revalidatePath("/admin/integracoes");
  revalidatePath("/", "layout");
  return { ok: true, themes: clean };
}

export async function saveSellerCtaSettings(settings: SellerCtaSettings) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  await upsertSetting("seller_cta", settings);

  revalidatePath("/admin/integracoes");
  revalidatePath("/", "layout");
  redirect("/admin/integracoes");
}

export async function saveGrainSettings(settings: GrainSettings) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  await upsertSetting("grain", settings);

  // "layout" pra revalidar app/layout.tsx (raiz) — é lá que --grain-opacity
  // é lido e aplicado no <body>, não numa página específica.
  revalidatePath("/", "layout");
  revalidatePath("/admin/integracoes");
  redirect("/admin/integracoes");
}
