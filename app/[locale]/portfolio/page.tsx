import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates, localizedUrl } from "@/lib/locale-alternates";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { CuratedCollection } from "@/app/components/CuratedCollection";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { BreadcrumbSchema } from "@/app/components/BreadcrumbSchema";
import { getProperties, getCardCovers } from "@/lib/properties";
import { getCardFromPrices } from "@/lib/property-typologies";
import { getCardCarouselSettings } from "@/lib/settings";
import { Link } from "@/i18n/navigation";
import { BRASIL_UI } from "@/lib/brasil-developments";
import type { AppLocale } from "@/i18n/routing";

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
    alternates: { canonical: localizedUrl(locale, "/portfolio"), languages: localeAlternates("/portfolio") },
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
  const cardCarousel = await getCardCarouselSettings();
  const covers = await getCardCovers(properties, cardCarousel);
  const fromPrices = await getCardFromPrices(properties);
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
        <CuratedCollection
          properties={properties}
          covers={covers}
          fromPrices={fromPrices}
          coverIntervalMs={cardCarousel.intervalSeconds * 1000}
          hideHeading
        />
        <div className="bg-background px-6 pb-16 text-center md:px-12">
          <Link
            href="/empreendimentos-brasil"
            className="inline-block text-xs tracking-[0.15em] uppercase text-accent border-b border-accent/40 pb-1 transition-colors hover:text-accent-strong hover:border-accent-strong"
          >
            {(BRASIL_UI[locale as AppLocale] ?? BRASIL_UI["pt-PT"]).navLabel} →
          </Link>
        </div>
      </main>
      <SiteFooter />
      <SiteWhatsAppFloating />
      <ScheduleCallFloating />
    </>
  );
}
