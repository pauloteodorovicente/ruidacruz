import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { translateBatch } from "@/lib/deepl";

const TARGET_LOCALES = ["pt-BR", "en", "es", "fr", "it", "de"];

// Mesmo padrão de translate-property.ts — nunca sobrescreve uma tradução
// marcada "human" (curada à mão), roda em background via after() no server
// action de salvar tipologia, nunca trava o fluxo de salvar.
export async function translateTypologyToAllLocales(
  typologyId: string,
  content: { name: string; description: string | null },
) {
  const texts = [content.name, content.description ?? ""];
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("property_typology_translations")
    .select("locale, translation_source")
    .eq("typology_id", typologyId);
  const humanLocales = new Set((existing ?? []).filter((r) => r.translation_source === "human").map((r) => r.locale));

  await Promise.all(
    TARGET_LOCALES.filter((locale) => !humanLocales.has(locale)).map(async (locale) => {
      try {
        const translated = await translateBatch(texts, locale);
        const [name, description] = translated;

        await supabase.from("property_typology_translations").upsert(
          {
            typology_id: typologyId,
            locale,
            name,
            description: content.description ? description : null,
            translation_source: "ai",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "typology_id,locale" },
        );
      } catch (error) {
        console.error(`Falha ao traduzir tipologia ${typologyId} para ${locale}:`, error);
      }
    }),
  );
}
