import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/locale-alternates";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { CuratedCollection } from "@/app/components/CuratedCollection";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { BreadcrumbSchema } from "@/app/components/BreadcrumbSchema";
import { getProperties } from "@/lib/properties";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.portfolioPage.meta" });
  const title = t("title");
  const description = t("description");
  return {
    title,
    description,
    alternates: { languages: localeAlternates("/portfolio") },
    openGraph: {
      title,
      description,
      images: ["/images/rui/hero-portrait.jpg"],
      type: "website",
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const properties = await getProperties();
  const t = await getTranslations({ locale, namespace: "home.portfolioPage" });
  const prefix = locale === "pt-PT" ? "" : `/${locale}`;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", path: prefix || "/" },
          { name: t("title"), path: `${prefix}/portfolio` },
        ]}
      />
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 pt-32 pb-4 md:px-12 md:pt-40">
          <h1 className="font-display text-3xl md:text-4xl mb-3">{t("title")}</h1>
          <p className="text-sm text-foreground-muted">{t("subtitle")}</p>
        </div>
        <CuratedCollection properties={properties} hideHeading />
      </main>
      <SiteFooter />
      <SiteWhatsAppFloating />
      <ScheduleCallFloating />
    </>
  );
}
