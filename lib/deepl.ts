import "server-only";

// Helper fino sobre a API do DeepL — usado hoje pelo script de tradução dos
// textos estáticos (scripts/translate-messages.mjs) e, mais adiante, pela
// tradução automática de imóveis na publicação (ver lib/property-types.ts —
// PropertyTranslation.translation_source: "ai" | "human").
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

// DeepL usa "PT-BR"/"PT-PT" (maiúsculo) como target_lang; source é sempre
// PT-PT (fonte única de verdade do site, ver memória project-i18n-strategy).
const DEEPL_TARGET_LANG: Record<string, string> = {
  "pt-BR": "PT-BR",
  en: "EN-US",
  es: "ES",
  fr: "FR",
  it: "IT",
  de: "DE",
};

export async function translateBatch(texts: string[], targetLocale: string): Promise<string[]> {
  const targetLang = DEEPL_TARGET_LANG[targetLocale];
  if (!targetLang) throw new Error(`Sem mapeamento DeepL para o locale "${targetLocale}"`);
  if (texts.length === 0) return [];

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY não configurada");

  const params = new URLSearchParams();
  for (const text of texts) params.append("text", text);
  params.append("source_lang", "PT");
  params.append("target_lang", targetLang);

  const res = await fetch(DEEPL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!res.ok) {
    throw new Error(`DeepL respondeu ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as { translations: { text: string }[] };
  return data.translations.map((t) => t.text);
}
