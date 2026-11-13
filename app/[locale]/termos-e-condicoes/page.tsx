import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates, localizedUrl } from "@/lib/locale-alternates";
import { LegalPage } from "@/app/components/site/LegalPage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  const title = `${t("terms.title")} | Rui Da Cruz`;
  return {
    title,
    alternates: { canonical: localizedUrl(locale, "/termos-e-condicoes"), languages: localeAlternates("/termos-e-condicoes") },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LegalPage locale={locale} kind="terms" />;
}
