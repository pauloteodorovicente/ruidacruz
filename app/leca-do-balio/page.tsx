import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyByReference } from "@/lib/properties";
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
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { Footer } from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Moradia T5 Leça do Balio | Uma Propriedade Rara — Rui Da Cruz",
  description:
    "Moradia T5 de arquitetura de autor num loteamento fechado de vinte residências em Leça do Balio, Matosinhos. 2.545 m² de terreno, piscina interior aquecida, a minutos do Porto.",
  openGraph: {
    title: "Moradia Leça do Balio | Uma Propriedade Rara",
    description:
      "Loteamento fechado de vinte residências, 2.545 m² de terreno, piscina aquecida. A minutos do Porto.",
    images: ["/images/leca-do-balio/01-hero-fachada.jpg"],
    locale: "pt_PT",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  name: "Moradia T5 Leça do Balio",
  description:
    "Moradia T5 de arquitetura de autor num loteamento fechado de vinte residências em Leça do Balio, Matosinhos. 2.545 m² de terreno, piscina interior aquecida.",
  url: "https://ruidacruzconsultor.com/leca-do-balio",
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

export default async function LecaDoBalioPage() {
  // Controle de publicação vem do registo em properties (ref 122481641-38) —
  // despublicar no admin tira a página do ar sem precisar de deploy.
  const property = await getPropertyByReference("122481641-38");
  if (!property?.published) notFound();

  return (
    <LanguageProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
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
        <Related />
        <LeadForm />
      </main>
      <Footer />
      <WhatsAppFloating />
      <ScheduleCallFloating />
    </LanguageProvider>
  );
}
