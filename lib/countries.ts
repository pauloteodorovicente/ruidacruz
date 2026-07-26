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
// (nativo do navegador, sem precisar traduzir 245 nomes à mão). locale é
// qualquer tag BCP-47 válida ("pt-PT", "en", "es"...) — os chamadores
// convertem o próprio locale interno pra essa forma antes de chamar.
export function getCountryOptions(locale: string): CountryOption[] {
  const displayNames = new Intl.DisplayNames([locale], { type: "region" });

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
