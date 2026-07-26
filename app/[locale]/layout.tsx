import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { HtmlLangSync } from "@/app/components/site/HtmlLangSync";

// Só as páginas institucionais (Home, /sobre, /contacto, /imoveis/*) passam
// por aqui — /leca-do-balio e /admin ficam fora da árvore [locale] de
// propósito (ver proxy.ts) e continuam no LanguageProvider antigo.
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
      {children}
    </NextIntlClientProvider>
  );
}
