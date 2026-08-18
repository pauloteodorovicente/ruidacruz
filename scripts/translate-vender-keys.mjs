// Script único (não roda em produção) — traduz só as chaves novas
// siteNav.vender + vender.* pra pt-BR/es/fr/it/de via DeepL, mesclando no
// JSON existente sem tocar em nenhuma outra chave. pt-PT e en já foram
// escritos à mão. Uso: node scripts/translate-vender-keys.mjs
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

const source = JSON.parse(readFileSync(path.join(root, "messages/pt-PT.json"), "utf8"));

const entries = [
  { path: "siteNav.vender", value: source.siteNav.vender },
  { path: "vender.meta.title", value: source.vender.meta.title },
  { path: "vender.meta.description", value: source.vender.meta.description },
  { path: "vender.eyebrow", value: source.vender.eyebrow },
  { path: "vender.title", value: source.vender.title },
  { path: "vender.subtitle", value: source.vender.subtitle },
  { path: "vender.submit", value: source.vender.submit },
];
const texts = entries.map((e) => e.value);

function setPath(obj, dotted, value) {
  const parts = dotted.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (cur[key] === undefined) cur[key] = {};
    cur = cur[key];
  }
  cur[parts[parts.length - 1]] = value;
}

async function translateBatch(list, targetLang) {
  const params = new URLSearchParams();
  for (const text of list) params.append("text", text);
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

for (const [locale, targetLang] of Object.entries(DEEPL_TARGET_LANG)) {
  console.log(`Traduzindo chaves de vender/siteNav.vender para ${locale}...`);
  const translated = await translateBatch(texts, targetLang);
  const filePath = path.join(root, `messages/${locale}.json`);
  const existing = JSON.parse(readFileSync(filePath, "utf8"));
  entries.forEach((entry, i) => setPath(existing, entry.path, translated[i]));
  writeFileSync(filePath, JSON.stringify(existing, null, 2) + "\n");
  console.log(`  messages/${locale}.json atualizado (${texts.length} strings novas, resto intocado).`);
}
