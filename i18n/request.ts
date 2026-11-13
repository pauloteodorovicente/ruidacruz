import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { getSourceOverrides } from "@/lib/settings";
import { applyOverrides } from "@/lib/content-overrides";
import { adaptPtBrDeep } from "@/lib/ptbr-adapt";

// pt-BR passa sempre pelo adaptador (ver lib/ptbr-adapt.ts); o resultado fica em cache por processo.
let ptBrCache: unknown;
function adaptedMessages<T>(locale: string, messages: T): T {
  if (locale !== "pt-BR") return messages;
  return (ptBrCache ??= adaptPtBrDeep(messages)) as T;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    // Textos editados no admin (Textos das páginas) por cima do catálogo; sem edição, o catálogo é usado como está.
    messages: applyOverrides(adaptedMessages(locale, (await import(`../messages/${locale}.json`)).default), await getSourceOverrides("site", locale)),
  };
});
