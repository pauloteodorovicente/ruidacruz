import type { FlagCode } from "@/app/components/FlagIcon";

// Países mais relevantes pro público do Rui (Portugal + principais origens de
// comprador internacional). "mask": "9" = um dígito, qualquer outro
// caractere é literal (espaço, parêntese, hífen) — formato mais usual de
// cada país, pra quem digita reconhecer que acertou.
export const countryCodes = [
  { code: "+351", flagCode: "PT" as FlagCode, label: "Portugal", mask: "999 999 999" },
  { code: "+55", flagCode: "BR" as FlagCode, label: "Brasil", mask: "(99) 99999-9999" },
  { code: "+44", flagCode: "GB" as FlagCode, label: "Reino Unido", mask: "9999 999999" },
  { code: "+1", flagCode: "US" as FlagCode, label: "Estados Unidos / Canadá", mask: "(999) 999-9999" },
  { code: "+33", flagCode: "FR" as FlagCode, label: "França", mask: "9 99 99 99 99" },
  { code: "+34", flagCode: "ES" as FlagCode, label: "Espanha", mask: "999 999 999" },
  { code: "+39", flagCode: "IT" as FlagCode, label: "Itália", mask: "999 999 9999" },
  { code: "+49", flagCode: "DE" as FlagCode, label: "Alemanha", mask: "999 9999999" },
  { code: "+31", flagCode: "NL" as FlagCode, label: "Países Baixos", mask: "9 99999999" },
  { code: "+32", flagCode: "BE" as FlagCode, label: "Bélgica", mask: "999 99 99 99" },
  { code: "+41", flagCode: "CH" as FlagCode, label: "Suíça", mask: "99 999 99 99" },
  { code: "+353", flagCode: "IE" as FlagCode, label: "Irlanda", mask: "99 999 9999" },
  { code: "+352", flagCode: "LU" as FlagCode, label: "Luxemburgo", mask: "999 999 999" },
] as const;

export const defaultCountryCode = countryCodes[0].code;

export type CountryCode = (typeof countryCodes)[number];
