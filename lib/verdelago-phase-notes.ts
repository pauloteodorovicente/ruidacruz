// Nota curta por fase do Verdelago ("Termina construção no 1.º semestre de 2027 ·
// últimas unidades"), mostrada no card da fase e acima da tabela de frações em
// /verdelago. Editável em Admin → Integrações → "Notas das fases do Verdelago"
// (Backlog 15/10, item d). Guardada em settings.verdelago_phase_notes:
// { "Fase 4": { "pt-PT": "...", "en": "...", ... } }. O texto é escrito em pt-PT e
// traduzido para os outros 6 idiomas ao guardar (DeepL).
export const PHASE_NOTE_LOCALES = ["pt-PT", "pt-BR", "en", "es", "fr", "it", "de"] as const;

export type VerdelagoPhaseNotes = Record<string, Record<string, string>>;

const MAX_PHASES = 12;
const MAX_LABEL = 40;
const MAX_TEXT = 200;

// Descarta fase sem rótulo, idioma desconhecido e texto vazio; exige pt-PT (a fonte).
export function sanitizeVerdelagoPhaseNotes(raw: unknown): VerdelagoPhaseNotes {
  const out: VerdelagoPhaseNotes = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [rawLabel, rawTexts] of Object.entries(raw as Record<string, unknown>)) {
    const label = rawLabel.trim().slice(0, MAX_LABEL);
    if (!label || Object.keys(out).length >= MAX_PHASES) continue;
    if (!rawTexts || typeof rawTexts !== "object") continue;
    const texts: Record<string, string> = {};
    for (const locale of PHASE_NOTE_LOCALES) {
      const value = (rawTexts as Record<string, unknown>)[locale];
      if (typeof value === "string" && value.trim()) texts[locale] = value.trim().slice(0, MAX_TEXT);
    }
    if (texts["pt-PT"]) out[label] = texts;
  }
  return out;
}

// Texto da fase no idioma pedido; cai para pt-PT se faltar tradução.
export function phaseNoteFor(notes: VerdelagoPhaseNotes, label: string, locale: string): string | undefined {
  const texts = notes[label];
  return texts?.[locale] ?? texts?.["pt-PT"];
}
