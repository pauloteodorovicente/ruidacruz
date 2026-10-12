import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { HtmlLangSync } from "@/app/components/site/HtmlLangSync";
import { ViewTransitions } from "@/app/components/site/ViewTransitions";

// Toda página pública passa por aqui: as institucionais (Home, /sobre,
// /contacto, /imoveis/*...) e as landings de campanha (Leça, Verdelago, Fase 6,
// Portimão, One Green Way). Só o /admin fica fora da árvore [locale] (painel
// interno, só português — ver proxy.ts).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <HtmlLangSync locale={locale} />
      <ViewTransitions>{children}</ViewTransitions>
    </NextIntlClientProvider>
  );
}
