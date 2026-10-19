// Textos editáveis no admin (Admin → Textos das páginas, pedido do Paulo, 19/10/2026).
//
// O texto de cada página continua escrito nos arquivos de conteúdo (lib/*-content.ts e
// messages/*.json) e esses valores são o PADRÃO: enquanto ninguém editar, o site é idêntico, letra
// por letra. O que se edita no admin vira uma "substituição" guardada no banco (settings.content_overrides)
// e é aplicada por cima do padrão, só nas folhas de texto:
//   { "verdelago": { "en": { "fase6.title": "Last phase", ... } }, "site": { "pt-PT": { "home.hero.title": "..." } } }
// O caminho é o das chaves do conteúdo, separadas por ponto; listas usam o número da posição
// ("amenities.items.2.name"). Apagar a substituição devolve o texto original.

export type ContentOverrides = Record<string, Record<string, Record<string, string>>>;

// Fontes de conteúdo que o admin edita (cada uma tem o seu padrão em código).
export const CONTENT_SOURCES = [
  { id: "site", label: "Site (Home, Sobre, Contacto, Portfólio, rodapé...)" },
  { id: "leca", label: "Leça do Balio" },
  { id: "verdelago", label: "Verdelago e Fase 6" },
  { id: "portimao", label: "Portimão — Praia da Rocha" },
  { id: "onegreenway", label: "One Green Way" },
] as const;
export type ContentSourceId = (typeof CONTENT_SOURCES)[number]["id"];

const MAX_VALUE_LENGTH = 4000;
const MAX_PATH_LENGTH = 200;
const MAX_ENTRIES = 4000;

// Chaves que guardam endereço de arquivo ou link: mexer nelas quebraria a página, então o editor as esconde.
const HIDDEN_KEY = /(^|\.)(src|href|url|image|icon|poster|video|file|id|slug)$/i;

export type FlatEntry = { path: string; value: string };

// Todas as folhas de texto do conteúdo, com o caminho de cada uma.
export function flattenStrings(node: unknown, prefix = ""): FlatEntry[] {
  if (typeof node === "string") return prefix ? [{ path: prefix, value: node }] : [];
  if (Array.isArray(node)) return node.flatMap((item, index) => flattenStrings(item, prefix ? `${prefix}.${index}` : String(index)));
  if (node && typeof node === "object") {
    return Object.entries(node as Record<string, unknown>).flatMap(([key, value]) =>
      flattenStrings(value, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [];
}

// Folhas que o editor mostra (sem endereços de arquivo e links).
export function editableEntries(node: unknown): FlatEntry[] {
  return flattenStrings(node).filter((entry) => !HIDDEN_KEY.test(entry.path) && !/^(https?:|\/|mailto:|tel:)/.test(entry.value));
}

// Devolve o conteúdo com as substituições aplicadas. Sem substituições devolve o MESMO objeto (nada é copiado).
export function applyOverrides<T>(base: T, overrides: Record<string, string> | null | undefined): T {
  if (!overrides) return base;
  const paths = Object.keys(overrides);
  if (paths.length === 0) return base;
  const clone = structuredClone(base) as unknown;
  for (const path of paths) {
    const keys = path.split(".");
    let node: unknown = clone;
    for (let i = 0; i < keys.length - 1 && node !== undefined && node !== null; i++) {
      node = (node as Record<string, unknown>)[keys[i]];
    }
    const last = keys[keys.length - 1];
    if (node && typeof node === "object" && typeof (node as Record<string, unknown>)[last] === "string") {
      (node as Record<string, unknown>)[last] = overrides[path];
    }
  }
  return clone as T;
}

// Valor vindo do banco ou do admin: só texto, caminhos curtos e limites de tamanho.
export function sanitizeContentOverrides(raw: unknown): ContentOverrides {
  const out: ContentOverrides = {};
  if (!raw || typeof raw !== "object") return out;
  let count = 0;
  for (const [source, perLocale] of Object.entries(raw as Record<string, unknown>)) {
    if (!CONTENT_SOURCES.some((s) => s.id === source) || !perLocale || typeof perLocale !== "object") continue;
    for (const [locale, entries] of Object.entries(perLocale as Record<string, unknown>)) {
      if (!entries || typeof entries !== "object") continue;
      for (const [path, value] of Object.entries(entries as Record<string, unknown>)) {
        if (typeof value !== "string" || path.length > MAX_PATH_LENGTH || count >= MAX_ENTRIES) continue;
        (out[source] ??= {});
        (out[source][locale] ??= {})[path] = value.slice(0, MAX_VALUE_LENGTH);
        count += 1;
      }
    }
  }
  return out;
}
