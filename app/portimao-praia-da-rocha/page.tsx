import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyByReference } from "@/lib/properties";
import { PortimaoLanguageProvider } from "@/lib/portimao-language-context";
import { PortimaoHeader } from "@/app/components/portimao/PortimaoHeader";
import { PortimaoHero } from "@/app/components/portimao/PortimaoHero";
import { PortimaoIdentification } from "@/app/components/portimao/PortimaoIdentification";
import { PortimaoNarrative } from "@/app/components/portimao/PortimaoNarrative";
import { PortimaoAmenities } from "@/app/components/portimao/PortimaoAmenities";
import { PortimaoGallery } from "@/app/components/portimao/PortimaoGallery";
import { PortimaoPricing } from "@/app/components/portimao/PortimaoPricing";
import { PortimaoLeadForm } from "@/app/components/portimao/PortimaoLeadForm";
import { PortimaoWhatsApp } from "@/app/components/portimao/PortimaoWhatsApp";
import { PortimaoFooter } from "@/app/components/portimao/PortimaoFooter";

export const metadata: Metadata = {
  title: "Apartamento T1 Praia da Rocha | Arrendamento de Férias — Rui Da Cruz",
  description:
    "Apartamento T1 para arrendamento semanal, Edifício Alto da Foz, Praia da Rocha, Portimão. Piscina, varanda e a poucos minutos da praia.",
  openGraph: {
    title: "Apartamento T1 Praia da Rocha | Arrendamento de Férias",
    description: "Piscina, varanda e a poucos minutos da praia — arrendamento exclusivo por semana.",
    images: ["/images/portimao-praia-rocha/Apart T1 Praia_Rocha_10.jpeg"],
    locale: "pt_PT",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Apartamento T1 Praia da Rocha",
  description:
    "Apartamento T1 para arrendamento semanal, Edifício Alto da Foz, Praia da Rocha, Portimão.",
  url: "https://ruidacruzconsultor.com/portimao-praia-da-rocha",
  image: "https://ruidacruzconsultor.com/images/portimao-praia-rocha/Apart T1 Praia_Rocha_10.jpeg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Estrada da Rocha — Edifício Alto da Foz, São Francisco 18",
    addressLocality: "Portimão",
    postalCode: "8500-804",
    addressCountry: "PT",
  },
};

export default async function PortimaoPage() {
  // Controle de publicação vem do registo em properties (ref
  // "portimao-praia-da-rocha") — mesmo padrão da Leça e do Verdelago.
  const property = await getPropertyByReference("portimao-praia-da-rocha");
  if (!property?.published) notFound();

  return (
    <PortimaoLanguageProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortimaoHeader />
      <main className="flex-1">
        <PortimaoHero />
        <PortimaoIdentification />
        <PortimaoNarrative />
        <PortimaoAmenities />
        <PortimaoGallery />
        <PortimaoPricing />
        <PortimaoLeadForm />
      </main>
      <PortimaoWhatsApp />
      <PortimaoFooter />
    </PortimaoLanguageProvider>
  );
}
