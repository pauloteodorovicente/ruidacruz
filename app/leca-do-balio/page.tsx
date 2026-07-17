import { LanguageProvider } from "@/lib/language-context";
import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { PropertyIdentification } from "@/app/components/PropertyIdentification";
import { Narrative } from "@/app/components/Narrative";
import { Features } from "@/app/components/Features";
import { Gallery } from "@/app/components/Gallery";
import { FloorPlan } from "@/app/components/FloorPlan";
import { Location } from "@/app/components/Location";
import { Testimonials } from "@/app/components/Testimonials";
import { LeadForm } from "@/app/components/LeadForm";
import { WhatsAppFloating } from "@/app/components/WhatsAppFloating";
import { Footer } from "@/app/components/Footer";
import { MetaPixel } from "@/app/components/MetaPixel";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  name: "Moradia T5 Leça do Balio",
  description:
    "Moradia T5 de arquitetura de autor num loteamento fechado de vinte residências em Leça do Balio, Matosinhos. 2.545 m² de terreno, piscina interior aquecida.",
  url: "https://ruidacruzconsultor.pt/leca-do-balio",
  image: "https://ruidacruzconsultor.pt/images/leca-do-balio/01-hero-fachada.jpg",
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

export default function LecaDoBalioPage() {
  return (
    <LanguageProvider>
      <MetaPixel />
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
        <Gallery />
        <FloorPlan />
        <Location />
        <Testimonials />
        <LeadForm />
      </main>
      <Footer />
      <WhatsAppFloating />
    </LanguageProvider>
  );
}
