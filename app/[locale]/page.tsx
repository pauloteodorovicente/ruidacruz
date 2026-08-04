import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/locale-alternates";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { DynamicHero } from "@/app/components/site/DynamicHero";
import { CredibilityStrip } from "@/app/components/CredibilityStrip";
import { CuratedCollection } from "@/app/components/CuratedCollection";
import { AboutRui } from "@/app/components/AboutRui";
import { SiteTestimonials } from "@/app/components/site/SiteTestimonials";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { getProperties } from "@/lib/properties";
import { getTestimonials } from "@/lib/testimonials";
import { getHomeHero } from "@/lib/home-hero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  const title = t("title");
  const description = t("description");
  return {
    title,
    description,
    alternates: { languages: localeAlternates("/") },
    openGraph: {
      title,
      description,
      images: ["/images/rui/hero-portrait.jpg"],
      type: "website",
    },
  };
}

export default async function HomePage() {
  const properties = await getProperties();
  const testimonials = await getTestimonials();
  const hero = await getHomeHero();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <DynamicHero hero={hero} />
        <CredibilityStrip />
        <CuratedCollection properties={properties} />
        <AboutRui />
        <SiteTestimonials testimonials={testimonials} />
      </main>
      <SiteFooter />
      <SiteWhatsAppFloating />
    </>
  );
}
