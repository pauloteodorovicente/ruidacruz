import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getPropertyByReference, getPropertyPhotos } from "@/lib/properties";
import { getSellerCtaSettings } from "@/lib/settings";
import { getPropertyTypologies, getTypologyTranslations } from "@/lib/property-typologies";
import { localeAlternates, localizedUrl } from "@/lib/locale-alternates";
import { OG_LOCALE } from "@/lib/campaign-i18n";
import { content } from "@/lib/onegreenway-content";
import { OneGreenwayLanguageProvider } from "@/lib/onegreenway-language-context";
import type { OneGreenwayTypologyGroup } from "@/app/components/onegreenway/OneGreenwayTypologies";
import { OneGreenwayHeader } from "@/app/components/onegreenway/OneGreenwayHeader";
import { OneGreenwayHero } from "@/app/components/onegreenway/OneGreenwayHero";
import { OneGreenwayIdentification } from "@/app/components/onegreenway/OneGreenwayIdentification";
import { OneGreenwayNarrative } from "@/app/components/onegreenway/OneGreenwayNarrative";
import { OneGreenwayAmenities } from "@/app/components/onegreenway/OneGreenwayAmenities";
import { OneGreenwayGallery } from "@/app/components/onegreenway/OneGreenwayGallery";
import { OneGreenwayTypologies } from "@/app/components/onegreenway/OneGreenwayTypologies";
import { OneGreenwayBrochure } from "@/app/components/onegreenway/OneGreenwayBrochure";
import { OneGreenwayLeadForm } from "@/app/components/onegreenway/OneGreenwayLeadForm";
import { OneGreenwayWhatsApp } from "@/app/components/onegreenway/OneGreenwayWhatsApp";
import { PagePalette } from "@/app/components/site/PagePalette";
import { LandingLanguageAutoDetect } from "@/app/components/site/LandingLanguageAutoDetect";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { OneGreenwayFooter } from "@/app/components/onegreenway/OneGreenwayFooter";

// Caminho sem prefixo de idioma — pt-PT fica em /onegreenway (a URL de
// sempre, a mesma dos anúncios e links em circulação) e os outros 6 em
// /en/onegreenway, /es/onegreenway...
const PATH = "/onegreenway";

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
      images: ["/images/onegreenway/hero-1.jpg"],
      locale: OG_LOCALE[locale],
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

// Descrição em português mantida como era (texto próprio do schema); nos
// outros idiomas usa a descrição da página, já traduzida.
const JSON_LD_DESCRIPTION_PT =
  "Empreendimento residencial fechado com 89 residências de luxo — moradias V4 a V6 e apartamentos T3 a T5 — junto ao North Course, Quinta do Lago.";

function buildJsonLd(locale: (typeof routing.locales)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: "One Green Way",
    description: locale === "pt-PT" ? JSON_LD_DESCRIPTION_PT : content[locale].meta.description,
    inLanguage: locale,
    url: localizedUrl(locale, PATH),
    image: "https://ruidacruzconsultor.com/images/onegreenway/hero-1.jpg",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Quinta do Lago, Almancil",
      addressRegion: "Loulé, Algarve",
      postalCode: "8135-024",
      addressCountry: "PT",
    },
    numberOfAccommodationUnits: {
      "@type": "QuantitativeValue",
      unitText: "89 residências — V4 a V6 e T3 a T5",
    },
    broker: {
      "@type": "RealEstateAgent",
      name: "Rui Da Cruz",
      telephone: "+351939081583",
    },
  };
}

export default async function OneGreenwayPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // Controle de publicação vem do registo em properties (ref "onegreenway")
  // — mesmo padrão da Leça, Verdelago e Portimão.
  const property = await getPropertyByReference("onegreenway");
  if (!property?.published) notFound();
  const { enabled: sellerCtaEnabled } = await getSellerCtaSettings();
  // Fotos da galeria agora vêm de property_photos (editável no admin) —
  // achado (24/08): antes era um array fixo em onegreenway-content.ts,
  // sem como editar sem mexer em código.
  // Vídeos da galeria (media_type 'video') não entram nesta galeria só de fotos.
  const galleryPhotos = (await getPropertyPhotos(property.id)).filter((photo) => photo.media_type !== "video");

  // Tipologias + traduções agora vêm do banco (editável no admin, Fase 23)
  // em vez do array fixo "typologies.groups" de lib/onegreenway-content.ts.
  // Ao contrário do Verdelago (código técnico, não traduz), aqui o
  // nome/descrição são texto de marketing de verdade — precisa das 7
  // línguas; monta o pacote completo e o componente cliente escolhe o do
  // idioma da URL (useOneGreenwayLanguage).
  const typologies = await getPropertyTypologies(property.id);
  const translations = await getTypologyTranslations(typologies.map((t) => t.id));
  const typologyGroups: OneGreenwayTypologyGroup[] = typologies.map((typology) => {
    const byLocale: Record<string, { name: string; description: string }> = {
      "pt-PT": { name: typology.name, description: typology.description ?? "" },
    };
    for (const otherLocale of routing.locales) {
      if (otherLocale === "pt-PT") continue;
      const translation = translations.find((tr) => tr.typology_id === typology.id && tr.locale === otherLocale);
      byLocale[otherLocale] = {
        name: translation?.name || typology.name,
        description: translation?.description || typology.description || "",
      };
    }
    return { id: typology.id, priceFrom: typology.price_from, byLocale };
  });

  return (
    <OneGreenwayLanguageProvider locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(locale)) }} />
      <PagePalette slug={property.color_theme} />
      <LandingLanguageAutoDetect />
      <OneGreenwayHeader sellerCtaEnabled={sellerCtaEnabled} />
      <main className="flex-1">
        <OneGreenwayHero />
        <OneGreenwayIdentification />
        <OneGreenwayNarrative />
        <OneGreenwayAmenities />
        <OneGreenwayGallery photos={galleryPhotos.map((photo) => photo.storage_path)} />
        <OneGreenwayTypologies groups={typologyGroups} />
        <OneGreenwayBrochure />
        <OneGreenwayLeadForm />
      </main>
      <OneGreenwayWhatsApp />
      <ScheduleCallFloating />
      <OneGreenwayFooter sellerCtaEnabled={sellerCtaEnabled} />
    </OneGreenwayLanguageProvider>
  );
}
