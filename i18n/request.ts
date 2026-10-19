import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { getSourceOverrides } from "@/lib/settings";
import { applyOverrides } from "@/lib/content-overrides";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    // Textos editados no admin (Textos das páginas) por cima do catálogo; sem edição, o catálogo é usado como está.
    messages: applyOverrides((await import(`../messages/${locale}.json`)).default, await getSourceOverrides("site", locale)),
  };
});
