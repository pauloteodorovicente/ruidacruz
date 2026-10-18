// Ordem das seções da ficha do imóvel (Admin → editar imóvel → "Layout da página",
// pedido do Paulo, 18/10/2026). Sem ordem guardada, vale a ordem do "Modelo da
// Página" (layout_mode), como sempre foi. Com ordem guardada (properties.section_order),
// as seções aparecem nessa ordem; seção que não estiver na lista (por exemplo, uma
// seção nova no futuro) entra no fim, na ordem padrão.
import type { LayoutMode } from "@/lib/property-types";

export type SectionId = "details" | "tour" | "architect" | "highlights" | "location" | "gallery" | "floorplan";

export const SECTION_LABELS: Record<SectionId, string> = {
  details: "Dados do imóvel",
  tour: "Visita virtual",
  architect: "Arquitetura (assinatura do projeto)",
  highlights: "Destaques",
  location: "Localização",
  gallery: "Galeria",
  floorplan: "Planta",
};

// Ordem padrão de cada modelo (a mesma que a ficha já usava antes do editor).
export const DEFAULT_SECTION_ORDER: Record<LayoutMode, SectionId[]> = {
  arquitetura: ["details", "tour", "architect", "highlights", "gallery", "floorplan", "location"],
  paisagem_terreno: ["details", "tour", "highlights", "location", "gallery", "floorplan"],
  urbano: ["details", "tour", "location", "highlights", "gallery", "floorplan"],
};

export function defaultSectionOrder(mode: LayoutMode | null | undefined): SectionId[] {
  return DEFAULT_SECTION_ORDER[mode ?? "urbano"] ?? DEFAULT_SECTION_ORDER.urbano;
}

const KNOWN = new Set<string>(Object.keys(SECTION_LABELS));

// Valor vindo do banco ou de um formulário: descarta id desconhecido e repetido.
export function sanitizeSectionOrder(raw: unknown): SectionId[] | null {
  if (!Array.isArray(raw)) return null;
  const out: SectionId[] = [];
  for (const value of raw) {
    if (typeof value === "string" && KNOWN.has(value) && !out.includes(value as SectionId)) out.push(value as SectionId);
  }
  return out.length > 0 ? out : null;
}

// Ordem final: a guardada (se houver) e, no fim, o que o modelo padrão tem e ela não.
export function resolveSectionOrder(mode: LayoutMode | null | undefined, saved: unknown): SectionId[] {
  const base = defaultSectionOrder(mode);
  const custom = sanitizeSectionOrder(saved);
  if (!custom) return base;
  return [...custom, ...base.filter((id) => !custom.includes(id))];
}
