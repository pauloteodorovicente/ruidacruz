import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { translateBatch } from "@/lib/deepl";
import type { Locale } from "@/lib/property-types";

const TARGET_LOCALES: Locale[] = ["pt-BR", "en", "es", "fr", "it", "de"];

// Roda em background via after() no Server Action de publicar (nunca antes
// do redirect — traduzir não pode travar o fluxo de publicar, ver memória
// project-i18n-strategy: "Don't build a workflow that blocks publishing on
// translation completion"). Se o DeepL falhar pra um idioma, os outros
// continuam — nunca deixa a tradução de um derrubar as demais.
export async function translatePropertyToAllLocales(
  propertyId: string,
  content: { title: string; description: string | null; highlights: string[] },
) {
  const highlightsCount = content.highlights.length;
  const texts = [content.title, content.description ?? "", ...content.highlights];
  const supabase = createAdminClient();

  // Nunca sobrescreve uma tradução que o Rui já editou à mão (translation_source
  // 'human') — só re-traduz por IA os locales que ainda não têm tradução ou
  // que já eram 'ai'. Importante pra quando o editor manual (opcional, ainda
  // não construído) existir: sem isso, republicar o imóvel apagaria o texto
  // revisado por ele.
  const { data: existing } = await supabase
    .from("property_translations")
    .select("locale, translation_source")
    .eq("property_id", propertyId);
  const humanLocales = new Set((existing ?? []).filter((r) => r.translation_source === "human").map((r) => r.locale));

  await Promise.all(
    TARGET_LOCALES.filter((locale) => !humanLocales.has(locale)).map(async (locale) => {
      try {
        const translated = await translateBatch(texts, locale);
        const [title, description, ...highlights] = translated;

        await supabase.from("property_translations").upsert(
          {
            property_id: propertyId,
            locale,
            title,
            description: content.description ? description : null,
            highlights: highlightsCount > 0 ? highlights : [],
            translation_source: "ai",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "property_id,locale" },
        );
      } catch (error) {
        console.error(`Falha ao traduzir imóvel ${propertyId} para ${locale}:`, error);
      }
    }),
  );
}
