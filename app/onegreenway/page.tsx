import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyByReference } from "@/lib/properties";
import { getSellerCtaSettings } from "@/lib/settings";
import { getPropertyTypologies, getTypologyTranslations } from "@/lib/property-typologies";
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
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { OneGreenwayFooter } from "@/app/components/onegreenway/OneGreenwayFooter";

export const metadata: Metadata = {
  title: "One Green Way | Quinta do Lago — Rui Da Cruz",
  description:
    "One Green Way, Quinta do Lago — 89 residências de luxo junto ao North Course. Moradias V4-V6 e apartamentos T3-T5 representados por Rui Da Cruz, RE/MAX Vantagem.",
  openGraph: {
    title: "One Green Way | Quinta do Lago",
    description: "89 residências de luxo junto ao North Course, entre campo de golfe, lagos e a Ria Formosa.",
    images: ["/images/onegreenway/hero-1.jpg"],
    locale: "pt_PT",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  name: "One Green Way",
  description:
    "Empreendimento residencial fechado com 89 residências de luxo — moradias V4 a V6 e apartamentos T3 a T5 — junto ao North Course, Quinta do Lago.",
  url: "https://ruidacruzconsultor.com/onegreenway",
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

export default async function OneGreenwayPage() {
  // Controle de publicação vem do registo em properties (ref "onegreenway")
  // — mesmo padrão da Leça, Verdelago e Portimão.
  const property = await getPropertyByReference("onegreenway");
  if (!property?.published) notFound();
  const { enabled: sellerCtaEnabled } = await getSellerCtaSettings();

  // Tipologias + traduções agora vêm do banco (editável no admin, Fase 23)
  // em vez do array fixo "typologies.groups" de lib/onegreenway-content.ts.
  // Ao contrário do Verdelago (código técnico, não traduz), aqui o
  // nome/descrição são texto de marketing de verdade — precisa das 7
  // línguas; como esta página não tem locale na URL, monta o pacote
  // completo aqui e deixa o componente cliente escolher (useOneGreenwayLanguage).
  const typologies = await getPropertyTypologies(property.id);
  const translations = await getTypologyTranslations(typologies.map((t) => t.id));
  const ALL_LOCALES = ["pt-PT", "pt-BR", "en", "es", "fr", "it", "de"];
  const typologyGroups: OneGreenwayTypologyGroup[] = typologies.map((typology) => {
    const byLocale: Record<string, { name: string; description: string }> = {
      "pt-PT": { name: typology.name, description: typology.description ?? "" },
    };
    for (const locale of ALL_LOCALES) {
      if (locale === "pt-PT") continue;
      const translation = translations.find((tr) => tr.typology_id === typology.id && tr.locale === locale);
      byLocale[locale] = {
        name: translation?.name || typology.name,
        description: translation?.description || typology.description || "",
      };
    }
    return { id: typology.id, priceFrom: typology.price_from, byLocale };
  });

  return (
    <OneGreenwayLanguageProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <OneGreenwayHeader sellerCtaEnabled={sellerCtaEnabled} />
      <main className="flex-1">
        <OneGreenwayHero />
        <OneGreenwayIdentification />
        <OneGreenwayNarrative />
        <OneGreenwayAmenities />
        <OneGreenwayGallery />
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
