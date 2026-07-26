import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { HomeHero } from "@/app/components/HomeHero";
import { CredibilityStrip } from "@/app/components/CredibilityStrip";
import { CuratedCollection } from "@/app/components/CuratedCollection";
import { AboutRui } from "@/app/components/AboutRui";
import { SiteTestimonials } from "@/app/components/site/SiteTestimonials";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { MetaPixel } from "@/app/components/MetaPixel";
import { getProperties } from "@/lib/properties";
import { getTestimonials } from "@/lib/testimonials";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function HomePage() {
  const properties = await getProperties();
  const testimonials = await getTestimonials();

  return (
    <>
      <MetaPixel />
      <SiteHeader />
      <main className="flex-1">
        <HomeHero />
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
