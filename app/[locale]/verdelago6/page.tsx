import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getPropertyByReference } from "@/lib/properties";
import { getSellerCtaSettings } from "@/lib/settings";
import { getPropertyTypologies, getPropertyUnits } from "@/lib/property-typologies";
import { localeAlternates, localizedUrl } from "@/lib/locale-alternates";
import { OG_LOCALE } from "@/lib/campaign-i18n";
import { content } from "@/lib/verdelago-content";
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
import { PagePalette } from "@/app/components/site/PagePalette";
import { LandingLanguageAutoDetect } from "@/app/components/site/LandingLanguageAutoDetect";
import { PropertyNavArrows } from "@/app/components/PropertyNavArrows";
import { getNeighborArrows } from "@/lib/property-neighbors";
import { getSourceOverrides } from "@/lib/settings";
import { applyOverrides } from "@/lib/content-overrides";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { VerdelagoFooter } from "@/app/components/verdelago/VerdelagoFooter";

// Landing própria da Fase 6 do Verdelago (pedido do Rui 30/09–02/10, e do
// Paulo 08/10: página à parte, a geral continua em /verdelago). Publicar ou
// despublicar no admin (imóvel "verdelago6") liga/desliga esta página; as
// frações vêm do imóvel "verdelago" (mesma tabela de unidades, fase "Fase 6").
// Caminho sem prefixo de idioma — pt-PT fica em /verdelago6 (a URL de sempre,
// a do e-mail e dos links já enviados) e os outros 6 em /en/verdelago6...
const PATH = "/verdelago6";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const overrides = await getSourceOverrides("verdelago", locale);
  const { metaTitle: title, metaDescription: description } = applyOverrides(content[locale], overrides).fase6;

  return {
    title,
    description,
    alternates: { canonical: localizedUrl(locale, PATH), languages: localeAlternates(PATH) },
    openGraph: {
      title,
      description,
      images: ["/images/verdelago/04-apartamento.jpg"],
      locale: OG_LOCALE[locale],
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

// Descrição em português mantida como era (texto próprio do schema); nos
// outros idiomas usa a descrição da página, já traduzida.
const JSON_LD_DESCRIPTION_PT =
  "Última fase de vendas do Verdelago Resort: 21 frações, incluindo 4 de tipologia T4, junto ao Clube, ao SPA e ao acesso à praia, em Altura, Algarve.";

function buildJsonLd(locale: (typeof routing.locales)[number], metaDescription: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: "Verdelago Resort — Fase 6",
    description: locale === "pt-PT" ? JSON_LD_DESCRIPTION_PT : metaDescription,
    inLanguage: locale,
    url: localizedUrl(locale, PATH),
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
}

const FASE_6_LABEL = "Fase 6";

export default async function Verdelago6Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

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

  // Setas para o imóvel anterior e o próximo, na cor do vizinho (lib/property-neighbors.ts).
  const overrides = await getSourceOverrides("verdelago", locale);
  const neighbors = await getNeighborArrows(landing.id, locale);

  return (
    <VerdelagoLanguageProvider locale={locale} overrides={overrides}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(locale, applyOverrides(content[locale], overrides).fase6.metaDescription)) }} />
      <PagePalette slug={landing.color_theme} />
      <LandingLanguageAutoDetect />
      {neighbors && <PropertyNavArrows prev={neighbors.prev} next={neighbors.next} />}
      <VerdelagoHeader sellerCtaEnabled={sellerCtaEnabled} />
      <main className="flex-1">
        <VerdelagoFase6Hero />
        <VerdelagoFase6 available={available} sold={sold} />
        {phases.length > 0 && <VerdelagoUnidades verdelagoPhases={phases} openFirst />}
        <VerdelagoBrochure
          ptHref="/docs/verdelago/Verdelago-Fase6-Documento-Comercial-PT.pdf"
          enHref="/docs/verdelago/Verdelago-Fase6-Commercial-Document-EN.pdf"
          trackPt="doc_comercial_pt"
          trackEn="doc_comercial_en"
        />
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
