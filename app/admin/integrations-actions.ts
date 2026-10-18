"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeCardCarousel } from "@/lib/cover";
import type { CardCarouselSettings } from "@/lib/cover";
import { sanitizeTypeColorThemes } from "@/lib/property-colors";
import type { TypeColorThemes } from "@/lib/property-colors";
import { translateBatch } from "@/lib/deepl";
import {
  PHASE_NOTE_LOCALES,
  sanitizeVerdelagoPhaseNotes,
  type VerdelagoPhaseNotes,
} from "@/lib/verdelago-phase-notes";
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

// Guarda as notas das fases do Verdelago. O texto vem em pt-PT e é traduzido para os
// outros 6 idiomas aqui, antes de guardar (se o DeepL falhar, nada é guardado e o
// formulário mostra o erro).
export async function saveVerdelagoPhaseNotes(
  rows: { phase: string; text: string }[],
): Promise<{ ok: true; rows: { phase: string; text: string }[] }> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const source = sanitizeVerdelagoPhaseNotes(
    Object.fromEntries(rows.map((row) => [row.phase, { "pt-PT": row.text }])),
  );
  const phases = Object.keys(source);
  const ptTexts = phases.map((phase) => source[phase]["pt-PT"]);

  const notes: VerdelagoPhaseNotes = {};
  for (const phase of phases) notes[phase] = { "pt-PT": source[phase]["pt-PT"] };
  for (const locale of PHASE_NOTE_LOCALES) {
    if (locale === "pt-PT" || phases.length === 0) continue;
    const translated = await translateBatch(ptTexts, locale);
    phases.forEach((phase, index) => {
      notes[phase][locale] = translated[index];
    });
  }

  const clean = sanitizeVerdelagoPhaseNotes(notes);
  await upsertSetting("verdelago_phase_notes", clean);

  revalidatePath("/admin/integracoes");
  revalidatePath("/", "layout");
  return {
    ok: true,
    rows: Object.entries(clean).map(([phase, texts]) => ({ phase, text: texts["pt-PT"] })),
  };
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
