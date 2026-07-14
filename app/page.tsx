import { LanguageProvider } from "@/lib/language-context";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { PropertyIdentification } from "./components/PropertyIdentification";
import { Narrative } from "./components/Narrative";
import { Features } from "./components/Features";
import { Gallery } from "./components/Gallery";
import { Location } from "./components/Location";
import { LeadForm } from "./components/LeadForm";
import { WhatsAppFloating } from "./components/WhatsAppFloating";
import { Footer } from "./components/Footer";
import { MetaPixel } from "./components/MetaPixel";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  name: "Moradia T5 Leça do Balio",
  description:
    "Moradia T5 de arquitetura de autor num loteamento fechado de vinte residências em Leça do Balio, Matosinhos. 2.545 m² de terreno, piscina aquecida.",
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
    value: 700,
    unitCode: "MTK",
  },
  lotSize: {
    "@type": "QuantitativeValue",
    value: 2545,
    unitCode: "MTK",
  },
  broker: {
    "@type": "RealEstateAgent",
    name: "Rui da Cruz",
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
        <Location />
        <LeadForm />
      </main>
      <Footer />
      <WhatsAppFloating />
    </LanguageProvider>
  );
}
