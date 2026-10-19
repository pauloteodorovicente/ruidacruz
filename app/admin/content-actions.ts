"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getContentOverridesForAdmin } from "@/lib/settings";
import { translateBatch } from "@/lib/deepl";
import { CONTENT_SOURCES, editableEntries, sanitizeContentOverrides, type ContentOverrides, type ContentSourceId } from "@/lib/content-overrides";
import { isContentLocale, loadDefaultContent, type ContentLocale } from "@/lib/content-defaults";

const TARGET_LOCALES: ContentLocale[] = ["pt-BR", "en", "es", "fr", "it", "de"];

function assertSource(source: string): ContentSourceId {
  if (!CONTENT_SOURCES.some((s) => s.id === source)) throw new Error("Fonte de conteúdo desconhecida.");
  return source as ContentSourceId;
}

async function saveAll(overrides: ContentOverrides) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("settings")
    .upsert({ key: "content_overrides", value: sanitizeContentOverrides(overrides), updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/conteudo");
  revalidatePath("/", "layout");
}

// Guarda as edições de UMA fonte em UM idioma. `set` traz os textos editados; `clear` os caminhos que voltam
// ao texto original. Só vale o que existe no texto padrão da página (nada de caminho inventado), e um texto
// igual ao original nunca é guardado como edição.
export async function saveContentEdits(
  sourceId: string,
  localeId: string,
  set: Record<string, string>,
  clear: string[],
): Promise<{ ok: true; edited: number }> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const source = assertSource(sourceId);
  if (!isContentLocale(localeId)) throw new Error("Idioma desconhecido.");

  const defaults = new Map(editableEntries(await loadDefaultContent(source, localeId)).map((e) => [e.path, e.value]));
  const all = await getContentOverridesForAdmin();
  const current = { ...(all[source]?.[localeId] ?? {}) };

  for (const path of clear) delete current[path];
  for (const [path, value] of Object.entries(set)) {
    if (!defaults.has(path)) continue;
    if (value === defaults.get(path)) delete current[path];
    else current[path] = value;
  }

  all[source] = { ...(all[source] ?? {}), [localeId]: current };
  if (Object.keys(current).length === 0) delete all[source][localeId];
  if (Object.keys(all[source]).length === 0) delete all[source];
  await saveAll(all);
  return { ok: true, edited: Object.keys(current).length };
}

// Traduz para os outros 6 idiomas (DeepL) as edições feitas em português de Portugal, e as guarda como edições
// desses idiomas. Sobrescreve a edição anterior do mesmo texto nos outros idiomas.
export async function translateContentEdits(sourceId: string): Promise<{ ok: true; translated: number }> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const source = assertSource(sourceId);

  const all = await getContentOverridesForAdmin();
  const ptEdits = all[source]?.["pt-PT"] ?? {};
  const paths = Object.keys(ptEdits);
  if (paths.length === 0) return { ok: true, translated: 0 };

  let translated = 0;
  for (const locale of TARGET_LOCALES) {
    const valid = new Set(editableEntries(await loadDefaultContent(source, locale)).map((e) => e.path));
    const targets = paths.filter((path) => valid.has(path));
    const texts = targets.map((path) => ptEdits[path]);
    const results: string[] = [];
    for (let i = 0; i < texts.length; i += 40) results.push(...(await translateBatch(texts.slice(i, i + 40), locale)));
    const next = { ...(all[source]?.[locale] ?? {}) };
    targets.forEach((path, index) => {
      next[path] = results[index];
      translated += 1;
    });
    all[source] = { ...(all[source] ?? {}), [locale]: next };
  }
  await saveAll(all);
  return { ok: true, translated };
}
