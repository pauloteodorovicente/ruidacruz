// O que o Super-Destaque do card tem (Admin → editar imóvel → "Super-Destaque do card").
// Cada extra liga e desliga sozinho; a cor do card é à parte (properties.card_highlight_color).
// Guardado em properties.card_highlight_options; nulo = os padrões abaixo.
export type CardHighlightOptions = {
  badge: boolean; // selo "Em destaque" sobre a foto
  taller: boolean; // card um pouco mais alto, na mesma largura
  border: boolean; // borda na cor de destaque
  pulse: boolean; // brilho que pulsa devagar (como o botão "Falar com Rui")
};

export const CARD_HIGHLIGHT_DEFAULTS: CardHighlightOptions = { badge: true, taller: true, border: true, pulse: false };

export const CARD_HIGHLIGHT_LABELS: Record<keyof CardHighlightOptions, string> = {
  badge: "Selo “Em destaque” sobre a foto",
  taller: "Card um pouco mais alto (mesma largura)",
  border: "Borda na cor de destaque",
  pulse: "Brilho que pulsa devagar",
};

// Valor vindo do banco ou do formulário: só booleanos valem, o resto cai no padrão.
export function resolveCardHighlightOptions(raw: unknown): CardHighlightOptions {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const pick = (key: keyof CardHighlightOptions) =>
    typeof source[key] === "boolean" ? (source[key] as boolean) : CARD_HIGHLIGHT_DEFAULTS[key];
  return { badge: pick("badge"), taller: pick("taller"), border: pick("border"), pulse: pick("pulse") };
}
