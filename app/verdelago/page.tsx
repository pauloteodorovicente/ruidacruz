import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyByReference } from "@/lib/properties";
import { getSellerCtaSettings } from "@/lib/settings";
import { getPropertyTypologies, getPropertyUnits, getTypologyFloorplans } from "@/lib/property-typologies";
import { VerdelagoLanguageProvider } from "@/lib/verdelago-language-context";
import type { VerdelagoPhaseGroup, VerdelagoUnitRow } from "@/app/components/verdelago/VerdelagoUnidades";
import type { VerdelagoFloorplanItem } from "@/app/components/verdelago/VerdelagoFloorPlans";
import type { VerdelagoFeaturedUnit } from "@/app/components/verdelago/VerdelagoFeatured";
import { VerdelagoHeader } from "@/app/components/verdelago/VerdelagoHeader";
import { VerdelagoHero } from "@/app/components/verdelago/VerdelagoHero";
import { VerdelagoOverview } from "@/app/components/verdelago/VerdelagoOverview";
import { VerdelagoNarrative } from "@/app/components/verdelago/VerdelagoNarrative";
import { VerdelagoAmenities } from "@/app/components/verdelago/VerdelagoAmenities";
import { VerdelagoLifestyle } from "@/app/components/verdelago/VerdelagoLifestyle";
import { VerdelagoGallery } from "@/app/components/verdelago/VerdelagoGallery";
import { VerdelagoFloorPlans } from "@/app/components/verdelago/VerdelagoFloorPlans";
import { VerdelagoFeatured } from "@/app/components/verdelago/VerdelagoFeatured";
import { VerdelagoUnidades } from "@/app/components/verdelago/VerdelagoUnidades";
import { VerdelagoInvestment } from "@/app/components/verdelago/VerdelagoInvestment";
import { VerdelagoCertification } from "@/app/components/verdelago/VerdelagoCertification";
import { VerdelagoBrochure } from "@/app/components/verdelago/VerdelagoBrochure";
import { VerdelagoLocation } from "@/app/components/verdelago/VerdelagoLocation";
import { VerdelagoRelated } from "@/app/components/verdelago/VerdelagoRelated";
import { VerdelagoLeadForm } from "@/app/components/verdelago/VerdelagoLeadForm";
import { VerdelagoWhatsApp } from "@/app/components/verdelago/VerdelagoWhatsApp";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
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
  const { enabled: sellerCtaEnabled } = await getSellerCtaSettings();

  // Tipologias + unidades + plantas agora vêm do banco (editável no admin,
  // Fase 23) em vez dos arquivos fixos lib/verdelago-units.ts e o export
  // "floorplans" de lib/verdelago-content.ts.
  const typologies = await getPropertyTypologies(property.id);
  const [units, rawTypologyFloorplans] = await Promise.all([
    getPropertyUnits(property.id),
    getTypologyFloorplans(typologies.map((t) => t.id)),
  ]);
  const typologyNameById = new Map(typologies.map((t) => [t.id, t.name]));
  // Uma planta por tipologia (não por unidade — ainda não existe foto real
  // de cada fração). Se uma tipologia tiver mais de uma planta cadastrada,
  // usa a primeira.
  const plantaSrcByTypologyId = new Map<string, string>();
  for (const f of rawTypologyFloorplans) {
    if (!plantaSrcByTypologyId.has(f.typology_id)) plantaSrcByTypologyId.set(f.typology_id, f.storage_path);
  }

  const phaseOrder: string[] = [];
  const phaseMap = new Map<string, VerdelagoUnitRow[]>();
  for (const unit of units) {
    const label = unit.phase_label ?? "Sem fase";
    if (!phaseMap.has(label)) {
      phaseMap.set(label, []);
      phaseOrder.push(label);
    }
    phaseMap.get(label)!.push({
      lote: unit.lot,
      fracao: unit.fraction,
      tipologia: (unit.typology_id && typologyNameById.get(unit.typology_id)) || "—",
      valor: unit.price,
    });
  }
  const verdelagoPhases: VerdelagoPhaseGroup[] = phaseOrder.map((label) => ({ label, units: phaseMap.get(label)! }));

  const featuredUnits: VerdelagoFeaturedUnit[] = units
    .filter((unit) => unit.featured)
    .map((unit) => ({
      id: unit.id,
      tipologia: (unit.typology_id && typologyNameById.get(unit.typology_id)) || "—",
      lote: unit.lot,
      fracao: unit.fraction,
      valor: unit.price,
      plantaSrc: (unit.typology_id && plantaSrcByTypologyId.get(unit.typology_id)) || null,
    }));

  const floorplanItems: VerdelagoFloorplanItem[] = rawTypologyFloorplans.map((f) => ({
    id: f.id,
    src: f.storage_path,
    label: typologyNameById.get(f.typology_id) ?? "",
  }));

  return (
    <VerdelagoLanguageProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VerdelagoHeader sellerCtaEnabled={sellerCtaEnabled} />
      <main className="flex-1">
        <VerdelagoHero />
        <VerdelagoOverview />
        <VerdelagoNarrative />
        <VerdelagoAmenities />
        <VerdelagoLifestyle />
        <VerdelagoGallery />
        <VerdelagoFloorPlans floorplans={floorplanItems} />
        <VerdelagoFeatured units={featuredUnits} />
        <VerdelagoUnidades verdelagoPhases={verdelagoPhases} />
        <VerdelagoInvestment />
        <VerdelagoCertification />
        <VerdelagoBrochure />
        <VerdelagoLocation />
        <VerdelagoRelated />
        <VerdelagoLeadForm />
      </main>
      <VerdelagoWhatsApp />
      <ScheduleCallFloating />
      <VerdelagoFooter sellerCtaEnabled={sellerCtaEnabled} />
    </VerdelagoLanguageProvider>
  );
}
