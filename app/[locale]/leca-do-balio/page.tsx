import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getPropertyByReference } from "@/lib/properties";
import { getSellerCtaSettings } from "@/lib/settings";
import { getLowestAvailableUnitPrice } from "@/lib/property-typologies";
import { localeAlternates, localizedUrl } from "@/lib/locale-alternates";
import { OG_LOCALE } from "@/lib/campaign-i18n";
import { content } from "@/lib/content";
import { LanguageProvider } from "@/lib/language-context";
import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { PropertyIdentification } from "@/app/components/PropertyIdentification";
import { Narrative } from "@/app/components/Narrative";
import { Features } from "@/app/components/Features";
import { Lifestyle } from "@/app/components/Lifestyle";
import { Gallery } from "@/app/components/Gallery";
import { FloorPlan } from "@/app/components/FloorPlan";
import { Location } from "@/app/components/Location";
import { Testimonials } from "@/app/components/Testimonials";
import { Related } from "@/app/components/Related";
import { LeadForm } from "@/app/components/LeadForm";
import { WhatsAppFloating } from "@/app/components/WhatsAppFloating";
import { PagePalette } from "@/app/components/site/PagePalette";
import { LandingLanguageAutoDetect } from "@/app/components/site/LandingLanguageAutoDetect";
import { PropertyNavArrows } from "@/app/components/PropertyNavArrows";
import { getNeighborArrows } from "@/lib/property-neighbors";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { Footer } from "@/app/components/Footer";

// Caminho sem prefixo de idioma — pt-PT fica em /leca-do-balio (a URL de
// sempre, a dos anúncios) e os outros 6 em /en/leca-do-balio, /es/...
const PATH = "/leca-do-balio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const { title, description } = content[locale].meta;

  return {
    title,
    description,
    alternates: { canonical: localizedUrl(locale, PATH), languages: localeAlternates(PATH) },
    openGraph: {
      title,
      description,
      images: ["/images/leca-do-balio/01-hero-fachada.jpg"],
      locale: OG_LOCALE[locale],
      type: "website",
    },
  };
}

// Descrição em português mantida como era (texto próprio do schema); nos
// outros idiomas usa a descrição da página, já traduzida.
const JSON_LD_DESCRIPTION_PT =
  "Moradia T5 de arquitetura de autor num loteamento fechado de vinte residências em Leça do Balio, Matosinhos. 2.545 m² de terreno, piscina interior aquecida.";

function buildJsonLd(locale: (typeof routing.locales)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: "Moradia T5 Leça do Balio",
    description: locale === "pt-PT" ? JSON_LD_DESCRIPTION_PT : content[locale].meta.description,
    inLanguage: locale,
    url: localizedUrl(locale, PATH),
    image: "https://ruidacruzconsultor.com/images/leca-do-balio/01-hero-fachada.jpg",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Matosinhos",
      addressRegion: "Porto",
      addressCountry: "PT",
    },
    offers: {
      "@type": "Offer",
      price: "1950000",
      priceCurrency: "EUR",
    },
    numberOfRooms: 5,
    floorSize: {
      "@type": "QuantitativeValue",
      value: 431,
      unitCode: "MTK",
    },
    lotSize: {
      "@type": "QuantitativeValue",
      value: 2545,
      unitCode: "MTK",
    },
    broker: {
      "@type": "RealEstateAgent",
      name: "Rui Da Cruz",
      telephone: "+351939081583",
    },
  };
}

export default async function LecaDoBalioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // Controle de publicação vem do registo em properties (ref 122481641-38) —
  // despublicar no admin tira a página do ar sem precisar de deploy.
  const property = await getPropertyByReference("122481641-38");
  if (!property?.published) notFound();
  const { enabled: sellerCtaEnabled } = await getSellerCtaSettings();
  const verdelago = await getPropertyByReference("verdelago");
  const verdelagoFromPrice = verdelago ? await getLowestAvailableUnitPrice(verdelago.id) : null;

  // Setas para o imóvel anterior e o próximo, na cor do vizinho (lib/property-neighbors.ts).
  const neighbors = await getNeighborArrows(property.id, locale);

  return (
    <LanguageProvider locale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(locale)) }}
      />
      <PagePalette slug={property.color_theme} />
      <LandingLanguageAutoDetect />
      {neighbors && <PropertyNavArrows prev={neighbors.prev} next={neighbors.next} />}
      <Header sellerCtaEnabled={sellerCtaEnabled} />
      <main className="flex-1">
        <Hero />
        <PropertyIdentification />
        <Narrative />
        <Features />
        <Lifestyle />
        <Gallery />
        <FloorPlan />
        <Location />
        <Testimonials />
        <Related fromPrice={verdelagoFromPrice} />
        <LeadForm />
      </main>
      <Footer sellerCtaEnabled={sellerCtaEnabled} />
      <WhatsAppFloating />
      <ScheduleCallFloating />
    </LanguageProvider>
  );
}
