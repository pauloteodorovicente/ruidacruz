// Países mais relevantes pro público do Rui (Portugal + principais origens de
// comprador internacional). Sem isso, um número estrangeiro sem "+" é
// interpretado pelo GHL como português e sai corrompido.
export const countryCodes = [
  { code: "+351", flag: "🇵🇹", label: "Portugal" },
  { code: "+55", flag: "🇧🇷", label: "Brasil" },
  { code: "+44", flag: "🇬🇧", label: "Reino Unido" },
  { code: "+1", flag: "🇺🇸", label: "Estados Unidos / Canadá" },
  { code: "+33", flag: "🇫🇷", label: "França" },
  { code: "+34", flag: "🇪🇸", label: "Espanha" },
  { code: "+39", flag: "🇮🇹", label: "Itália" },
  { code: "+49", flag: "🇩🇪", label: "Alemanha" },
  { code: "+31", flag: "🇳🇱", label: "Países Baixos" },
  { code: "+32", flag: "🇧🇪", label: "Bélgica" },
  { code: "+41", flag: "🇨🇭", label: "Suíça" },
  { code: "+353", flag: "🇮🇪", label: "Irlanda" },
  { code: "+352", flag: "🇱🇺", label: "Luxemburgo" },
] as const;

export const defaultCountryCode = countryCodes[0].code;

export type CountryCode = (typeof countryCodes)[number];
