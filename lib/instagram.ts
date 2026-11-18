// Instagram na Home (Fase 27) — tipos e regras puras, sem dependência de servidor (importável
// do painel e da página). Os posts ficam em instagram_posts; layout, limite e liga/desliga em
// settings.instagram_section.

export type InstagramLayout = "grid" | "carousel";

export type InstagramSettings = {
  enabled: boolean;
  layout: InstagramLayout;
  maxPosts: number;
};

export const INSTAGRAM_LIMITS = { maxPosts: { min: 3, max: 24 } } as const;

// Desligado por padrão: a seção só aparece quando alguém liga no admin e há posts cadastrados.
export const INSTAGRAM_DEFAULTS: InstagramSettings = { enabled: false, layout: "grid", maxPosts: 8 };

export type InstagramPost = {
  id: string;
  image_url: string;
  post_url: string;
  caption: string | null;
  is_video: boolean;
  position: number;
  visible: boolean;
};

export function sanitizeInstagramSettings(raw: unknown): InstagramSettings {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const { min, max } = INSTAGRAM_LIMITS.maxPosts;
  const maxRaw = Number(source.maxPosts);
  return {
    enabled: typeof source.enabled === "boolean" ? source.enabled : INSTAGRAM_DEFAULTS.enabled,
    layout: source.layout === "carousel" ? "carousel" : "grid",
    maxPosts: Number.isFinite(maxRaw) ? Math.min(max, Math.max(min, Math.round(maxRaw))) : INSTAGRAM_DEFAULTS.maxPosts,
  };
}

// Aceita o link de um post/reel do Instagram e devolve a forma limpa (sem ?igsh=, sem nome de
// usuário no caminho). Qualquer outro endereço (outro site, javascript:, perfil) volta null.
export function normalizeInstagramPostUrl(input: string): { url: string; isVideo: boolean } | null {
  let parsed: URL;
  try {
    parsed = new URL(input.trim());
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  const host = parsed.hostname.toLowerCase();
  if (host !== "instagram.com" && host !== "www.instagram.com") return null;
  const match = parsed.pathname.match(/^\/(?:[A-Za-z0-9._]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]+)\/?/);
  if (!match) return null;
  const kind = match[1] === "reels" ? "reel" : match[1];
  return { url: `https://www.instagram.com/${kind}/${match[2]}/`, isVideo: kind !== "p" };
}

// "https://www.instagram.com/_ruidacruz_yourbestchoice/" -> "@_ruidacruz_yourbestchoice"
export function instagramHandle(profileUrl: string): string {
  try {
    const name = new URL(profileUrl).pathname.split("/").filter(Boolean)[0];
    return name ? `@${name}` : "Instagram";
  } catch {
    return "Instagram";
  }
}
