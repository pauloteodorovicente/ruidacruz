import { getCountries, getCountryCallingCode, getExampleNumber, type CountryCode } from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";

export type CountryOption = {
  iso: CountryCode;
  code: string;
  label: string;
  flagSrc: string;
  placeholder: string;
};

// Todos os países/regiões que a libphonenumber conhece (~245) — os mesmos
// dados que o Google usa. Nome do país localizado via Intl.DisplayNames
// (nativo do navegador, sem precisar traduzir 245 nomes à mão).
export function getCountryOptions(locale: "pt" | "en"): CountryOption[] {
  const displayNames = new Intl.DisplayNames([locale === "pt" ? "pt-PT" : "en"], { type: "region" });

  return getCountries()
    .map((iso) => {
      let placeholder = "";
      try {
        placeholder = getExampleNumber(iso, examples)?.formatNational() ?? "";
      } catch {
        placeholder = "";
      }
      return {
        iso,
        code: `+${getCountryCallingCode(iso)}`,
        label: displayNames.of(iso) ?? iso,
        flagSrc: `/flags/${iso.toLowerCase()}.svg`,
        placeholder,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, locale));
}

export const defaultCountryIso: CountryCode = "PT";
