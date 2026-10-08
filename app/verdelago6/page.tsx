import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyByReference } from "@/lib/properties";
import { getSellerCtaSettings } from "@/lib/settings";
import { getPropertyTypologies, getPropertyUnits } from "@/lib/property-typologies";
import { VerdelagoLanguageProvider } from "@/lib/verdelago-language-context";
import type { VerdelagoPhaseGroup, VerdelagoUnitRow } from "@/app/components/verdelago/VerdelagoUnidades";
import { VerdelagoHeader } from "@/app/components/verdelago/VerdelagoHeader";
import { VerdelagoFase6Hero } from "@/app/components/verdelago/VerdelagoFase6Hero";
import { VerdelagoFase6 } from "@/app/components/verdelago/VerdelagoFase6";
import { VerdelagoUnidades } from "@/app/components/verdelago/VerdelagoUnidades";
import { VerdelagoBrochure } from "@/app/components/verdelago/VerdelagoBrochure";
import { VerdelagoLocation } from "@/app/components/verdelago/VerdelagoLocation";
import { VerdelagoLeadForm } from "@/app/components/verdelago/VerdelagoLeadForm";
import { VerdelagoWhatsApp } from "@/app/components/verdelago/VerdelagoWhatsApp";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { VerdelagoFooter } from "@/app/components/verdelago/VerdelagoFooter";

// Landing própria da Fase 6 do Verdelago (pedido do Rui 30/09–02/10, e do
// Paulo 08/10: página à parte, a geral continua em /verdelago). Publicar ou
// despublicar no admin (imóvel "verdelago6") liga/desliga esta página; as
// frações vêm do imóvel "verdelago" (mesma tabela de unidades, fase "Fase 6").
export const metadata: Metadata = {
  title: "Verdelago Resort · Fase 6, a última fase de vendas | Rui Da Cruz",
  description:
    "Lançamento da Fase 6 do Verdelago Resort, a última fase de vendas: 21 frações, incluindo 4 T4, junto ao Clube, ao SPA e à praia. Representação por Rui Da Cruz, RE/MAX Collection.",
  alternates: { canonical: "https://ruidacruzconsultor.com/verdelago6" },
  openGraph: {
    title: "Verdelago Resort · Fase 6, a última fase de vendas",
    description: "21 frações, incluindo 4 T4, junto ao Clube, ao SPA e à praia — Altura, Algarve.",
    images: ["/images/verdelago/04-apartamento.jpg"],
    locale: "pt_PT",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  name: "Verdelago Resort — Fase 6",
  description:
    "Última fase de vendas do Verdelago Resort: 21 frações, incluindo 4 de tipologia T4, junto ao Clube, ao SPA e ao acesso à praia, em Altura, Algarve.",
  url: "https://ruidacruzconsultor.com/verdelago6",
  image: "https://ruidacruzconsultor.com/images/verdelago/04-apartamento.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Altura",
    addressRegion: "Castro Marim, Algarve",
    postalCode: "8950-411",
    addressCountry: "PT",
  },
  broker: {
    "@type": "RealEstateAgent",
    name: "Rui Da Cruz",
    telephone: "+351939081583",
  },
};

const FASE_6_LABEL = "Fase 6";

export default async function Verdelago6Page() {
  const landing = await getPropertyByReference("verdelago6");
  if (!landing?.published) notFound();
  const property = await getPropertyByReference("verdelago");
  if (!property) notFound();
  const { enabled: sellerCtaEnabled } = await getSellerCtaSettings();

  const typologies = await getPropertyTypologies(property.id);
  const units = await getPropertyUnits(property.id);
  const typologyNameById = new Map(typologies.map((t) => [t.id, t.name]));

  // Só a Fase 6; "oculto" fica fora (ex.: frações unidas nos T4), "vendido"
  // aparece marcado como Vendido.
  const rows: VerdelagoUnitRow[] = units
    .filter((unit) => unit.phase_label === FASE_6_LABEL && unit.status !== "oculto")
    .map((unit) => ({
      lote: unit.lot,
      fracao: unit.fraction,
      tipologia: (unit.typology_id && typologyNameById.get(unit.typology_id)) || "—",
      valor: unit.price,
      vendido: unit.status === "vendido",
    }));
  const phases: VerdelagoPhaseGroup[] = rows.length > 0 ? [{ label: FASE_6_LABEL, units: rows }] : [];
  const sold = rows.filter((row) => row.vendido).length;
  const available = rows.length - sold;

  return (
    <VerdelagoLanguageProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VerdelagoHeader sellerCtaEnabled={sellerCtaEnabled} />
      <main className="flex-1">
        <VerdelagoFase6Hero />
        <VerdelagoFase6 available={available} sold={sold} />
        {phases.length > 0 && <VerdelagoUnidades verdelagoPhases={phases} openFirst />}
        <VerdelagoBrochure />
        <VerdelagoLocation />
        <VerdelagoLeadForm
          property={{ reference: landing.reference, title: "Verdelago Resort — Fase 6", zone: "Sul" }}
        />
      </main>
      <VerdelagoWhatsApp />
      <ScheduleCallFloating />
      <VerdelagoFooter sellerCtaEnabled={sellerCtaEnabled} />
    </VerdelagoLanguageProvider>
  );
}
