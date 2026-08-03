import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyByReference } from "@/lib/properties";
import { VerdelagoLanguageProvider } from "@/lib/verdelago-language-context";
import { VerdelagoHeader } from "@/app/components/verdelago/VerdelagoHeader";
import { VerdelagoHero } from "@/app/components/verdelago/VerdelagoHero";
import { VerdelagoOverview } from "@/app/components/verdelago/VerdelagoOverview";
import { VerdelagoNarrative } from "@/app/components/verdelago/VerdelagoNarrative";
import { VerdelagoAmenities } from "@/app/components/verdelago/VerdelagoAmenities";
import { VerdelagoGallery } from "@/app/components/verdelago/VerdelagoGallery";
import { VerdelagoFloorPlans } from "@/app/components/verdelago/VerdelagoFloorPlans";
import { VerdelagoLocation } from "@/app/components/verdelago/VerdelagoLocation";
import { VerdelagoLeadForm } from "@/app/components/verdelago/VerdelagoLeadForm";
import { VerdelagoWhatsApp } from "@/app/components/verdelago/VerdelagoWhatsApp";
import { VerdelagoFooter } from "@/app/components/verdelago/VerdelagoFooter";

export const metadata: Metadata = {
  title: "Verdelago Resort | Apartamentos T2 e T3 no Algarve — Rui Da Cruz",
  description:
    "Apartamentos T2 e T3 no Verdelago Resort, um empreendimento turístico de 5 estrelas entre Altura e a Praia Verde, Algarve. Acesso direto à praia, SPA, piscinas e Resort Club. Representação por Rui Da Cruz, RE/MAX Collection.",
  openGraph: {
    title: "Verdelago Resort | Apartamentos T2 e T3 no Algarve",
    description:
      "Acesso direto à praia, SPA, piscinas, Resort Club e Kids Club — entre Altura e a Praia Verde, no litoral leste do Algarve.",
    images: ["/images/verdelago/01-hero-humanizada.jpg"],
    locale: "pt_PT",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  name: "Verdelago Resort",
  description:
    "Empreendimento turístico de 5 estrelas com apartamentos T2 e T3, entre Altura e a Praia Verde, Algarve. Acesso direto à praia, SPA, piscinas, Resort Club e Kids Club.",
  url: "https://ruidacruzconsultor.com/verdelago",
  image: "https://ruidacruzconsultor.com/images/verdelago/01-hero-humanizada.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Altura",
    addressRegion: "Castro Marim, Algarve",
    postalCode: "8950-411",
    addressCountry: "PT",
  },
  numberOfAccommodationUnits: {
    "@type": "QuantitativeValue",
    unitText: "T2 e T3",
  },
  broker: {
    "@type": "RealEstateAgent",
    name: "Rui Da Cruz",
    telephone: "+351939081583",
  },
};

export default async function VerdelagoPage() {
  // Controle de publicação vem do registo em properties (ref "verdelago") —
  // despublicar no admin tira a página do ar sem precisar de deploy.
  const property = await getPropertyByReference("verdelago");
  if (!property?.published) notFound();

  return (
    <VerdelagoLanguageProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VerdelagoHeader />
      <main className="flex-1">
        <VerdelagoHero />
        <VerdelagoOverview />
        <VerdelagoNarrative />
        <VerdelagoAmenities />
        <VerdelagoGallery />
        <VerdelagoFloorPlans />
        <VerdelagoLocation />
        <VerdelagoLeadForm />
      </main>
      <VerdelagoWhatsApp />
      <VerdelagoFooter />
    </VerdelagoLanguageProvider>
  );
}
