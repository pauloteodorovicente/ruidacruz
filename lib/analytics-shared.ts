// Regras compartilhadas do registro de visitas (cliente, API e painel). Sem cookies, sem IP,
// sem identificador persistente: cada evento guarda só o que está listado aqui.

// Tipos aceitos por /api/track. Os quatro primeiros já existiam; os outros três são da
// campanha Verdelago Fase 6 (visitas, cliques e downloads de PDF).
export const TRACKED_EVENT_TYPES = [
  "whatsapp_click",
  "floorplan_view",
  "map_view",
  "gallery_view",
  "page_view",
  "link_click",
  "pdf_download",
] as const;
export type TrackedEventType = (typeof TRACKED_EVENT_TYPES)[number];

// Campos permitidos em events.meta (qualquer outro é descartado no servidor).
export const META_FIELDS = ["path", "locale", "utm_source", "utm_medium", "utm_campaign", "ref", "link"] as const;
export type EventMeta = Partial<Record<(typeof META_FIELDS)[number], string>>;

const MAX_VALUE_LENGTH = 120;
const MAX_PATH_LENGTH = 200;

// Aceita só os campos permitidos, como texto curto e sem quebra de linha. Nunca confiar no que vem do navegador.
export function sanitizeMeta(raw: unknown): EventMeta {
  const out: EventMeta = {};
  if (!raw || typeof raw !== "object") return out;
  const source = raw as Record<string, unknown>;
  for (const key of META_FIELDS) {
    const value = source[key];
    if (typeof value !== "string") continue;
    const clean = value.replace(/[\r\n\t]+/g, " ").trim().slice(0, key === "path" ? MAX_PATH_LENGTH : MAX_VALUE_LENGTH);
    if (!clean) continue;
    if (key === "path" && !clean.startsWith("/")) continue;
    out[key] = clean;
  }
  return out;
}

// Origem do lead (primeira visita da sessão) guardada em leads.attribution.
export type Attribution = Pick<EventMeta, "utm_source" | "utm_medium" | "utm_campaign" | "ref">;

export function sanitizeAttribution(raw: unknown): Attribution | null {
  const meta = sanitizeMeta(raw);
  const attribution: Attribution = {};
  if (meta.utm_source) attribution.utm_source = meta.utm_source;
  if (meta.utm_medium) attribution.utm_medium = meta.utm_medium;
  if (meta.utm_campaign) attribution.utm_campaign = meta.utm_campaign;
  if (meta.ref) attribution.ref = meta.ref;
  return Object.keys(attribution).length > 0 ? attribution : null;
}

// Robôs e verificadores de link (inclusive os que abrem e-mails e anúncios): não contam como visita.
const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|headless|lighthouse|pagespeed|pingdom|uptime|monitor|curl|wget|python-requests|go-http-client|node-fetch|axios|okhttp|java\/|libwww|scanner|proofpoint|mimecast|barracuda|safelinks|googleimageproxy|feedfetcher/i;

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true; // sem user-agent não é um navegador de verdade
  return BOT_PATTERN.test(userAgent);
}

// "/en/verdelago6" e "/verdelago6" são a mesma página: o painel agrupa sem o prefixo de idioma.
const LOCALE_PREFIX = /^\/(pt-BR|en|es|fr|it|de)(?=\/|$)/;
export function stripLocale(path: string): string {
  const stripped = path.replace(LOCALE_PREFIX, "");
  return stripped === "" ? "/" : stripped;
}
