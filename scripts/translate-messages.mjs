// Script único (não roda em produção) pra gerar messages/{locale}.json das
// 5 línguas restantes a partir de messages/pt-PT.json via DeepL, preservando
// a estrutura/chaves. pt-PT e en já existem escritos à mão (não mexe neles).
// Uso: node scripts/translate-messages.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const envFile = readFileSync(path.join(root, ".env.local"), "utf8");
const apiKeyMatch = envFile.match(/^DEEPL_API_KEY=(.+)$/m);
if (!apiKeyMatch) throw new Error("DEEPL_API_KEY não encontrada em .env.local");
const DEEPL_API_KEY = apiKeyMatch[1].trim();

const DEEPL_TARGET_LANG = { "pt-BR": "PT-BR", es: "ES", fr: "FR", it: "IT", de: "DE" };

// Chaves com sintaxe ICU (plural) — traduzidas à mão abaixo, não pelo DeepL,
// pra não arriscar quebrar a sintaxe "{count, plural, one {...} other {...}}".
const ICU_SKIP_PATHS = new Set(["property.floorPlan.cta"]);

const HAND_TRANSLATIONS = {
  "pt-BR": { "property.floorPlan.cta": "Ver Plantas ({count, plural, one {# Andar} other {# Andares}})" },
  es: { "property.floorPlan.cta": "Ver Planos ({count, plural, one {# Planta} other {# Plantas}})" },
  fr: { "property.floorPlan.cta": "Voir les Plans ({count, plural, one {# Étage} other {# Étages}})" },
  it: { "property.floorPlan.cta": "Vedi Planimetrie ({count, plural, one {# Piano} other {# Piani}})" },
  de: { "property.floorPlan.cta": "Grundrisse Ansehen ({count, plural, one {# Etage} other {# Etagen}})" },
};

async function translateBatch(texts, targetLang) {
  if (texts.length === 0) return [];
  const params = new URLSearchParams();
  for (const text of texts) params.append("text", text);
  params.append("source_lang", "PT");
  params.append("target_lang", targetLang);

  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.translations.map((t) => t.text);
}

// Achata o JSON em [{path: "a.b.c", value: "string"}], preservando arrays de
// string (ex. sobre.credentials) como itens indexados "a.b.0".
function flatten(obj, prefix = "") {
  const out = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      out.push({ path, value });
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === "string") out.push({ path: `${path}.${i}`, value: item });
        else out.push(...flatten(item, `${path}.${i}`));
      });
    } else if (typeof value === "object" && value !== null) {
      out.push(...flatten(value, path));
    }
  }
  return out;
}

function setPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextKey = parts[i + 1];
    const isNextArrayIndex = /^\d+$/.test(nextKey);
    if (cur[key] === undefined) cur[key] = isNextArrayIndex ? [] : {};
    cur = cur[key];
  }
  cur[parts[parts.length - 1]] = value;
}

// Clona só a "forma" (estrutura de objetos/arrays) do source, sem os valores
// finais — serve de esqueleto pra reconstruir cada idioma traduzido.
function shape(obj) {
  if (typeof obj === "string") return "";
  if (Array.isArray(obj)) return obj.map(shape);
  if (typeof obj === "object" && obj !== null) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = shape(v);
    return out;
  }
  return obj;
}

const source = JSON.parse(readFileSync(path.join(root, "messages/pt-PT.json"), "utf8"));
const entries = flatten(source).filter((e) => !ICU_SKIP_PATHS.has(e.path));
const texts = entries.map((e) => e.value);

for (const [locale, targetLang] of Object.entries(DEEPL_TARGET_LANG)) {
  console.log(`Traduzindo para ${locale}...`);
  const translated = await translateBatch(texts, targetLang);
  const result = shape(source);
  entries.forEach((entry, i) => setPath(result, entry.path, translated[i]));
  for (const [icuPath, icuValue] of Object.entries(HAND_TRANSLATIONS[locale] ?? {})) {
    setPath(result, icuPath, icuValue);
  }
  writeFileSync(path.join(root, `messages/${locale}.json`), JSON.stringify(result, null, 2) + "\n");
  console.log(`  messages/${locale}.json escrito (${texts.length} strings).`);
}
