import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyByReference } from "@/lib/properties";
import { OneGreenwayLanguageProvider } from "@/lib/onegreenway-language-context";
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

  return (
    <OneGreenwayLanguageProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <OneGreenwayHeader />
      <main className="flex-1">
        <OneGreenwayHero />
        <OneGreenwayIdentification />
        <OneGreenwayNarrative />
        <OneGreenwayAmenities />
        <OneGreenwayGallery />
        <OneGreenwayTypologies />
        <OneGreenwayBrochure />
        <OneGreenwayLeadForm />
      </main>
      <OneGreenwayWhatsApp />
      <OneGreenwayFooter />
    </OneGreenwayLanguageProvider>
  );
}
