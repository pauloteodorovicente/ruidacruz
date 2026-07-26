import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPropertyByReference, getPropertyPhotos, getPropertyFloorplans } from "@/lib/properties";
import { localeAlternates } from "@/lib/locale-alternates";
import { getPropertyByReferenceForAdmin } from "@/lib/admin-properties";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { PropertyHero } from "@/app/components/PropertyHero";
import { PropertyDetails } from "@/app/components/PropertyDetails";
import { PropertyHighlights } from "@/app/components/PropertyHighlights";
import { PropertyGallery } from "@/app/components/PropertyGallery";
import { PropertyFloorPlan } from "@/app/components/PropertyFloorPlan";
import { PropertyLocation } from "@/app/components/PropertyLocation";
import { ArchitectCredit } from "@/app/components/ArchitectCredit";
import { SiteLeadForm } from "@/app/components/site/SiteLeadForm";
import type { Property, PropertyPhoto, PropertyFloorplan } from "@/lib/properties";
import type { ReactNode } from "react";

// Os 3 modos de layout reordenam/adicionam seções pra dar destaque ao que
// mais importa naquele tipo de imóvel — Arquitetura destaca quem assinou o
// projeto, Paisagem/Terreno e Urbano adiantam a Localização, só que com
// enquadramentos diferentes (jardim/terreno vs. vizinhança/cidade).
function sectionsForMode(property: Property, photos: PropertyPhoto[], floorplans: PropertyFloorplan[]): ReactNode[] {
  const details = <PropertyDetails property={property} key="details" />;
  const highlights = <PropertyHighlights property={property} key="highlights" />;
  const gallery = <PropertyGallery photos={photos} alt={property.title} key="gallery" />;
  const floorplan = <PropertyFloorPlan floorplans={floorplans} propertyReference={property.reference} key="floorplan" />;
  const location = <PropertyLocation property={property} key="location" />;

  switch (property.layout_mode) {
    case "arquitetura":
      return [details, <ArchitectCredit property={property} key="architect" />, highlights, gallery, floorplan, location];
    case "paisagem_terreno":
      return [details, highlights, location, gallery, floorplan];
    case "urbano":
      return [details, location, highlights, gallery, floorplan];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; referencia: string }>;
}): Promise<Metadata> {
  const { referencia } = await params;
  const property = await getPropertyByReference(referencia);
  if (!property) return {};

  return {
    title: `${property.title} | Rui Da Cruz`,
    description: property.description ?? undefined,
    alternates: { languages: localeAlternates(`/imoveis/${referencia}`) },
  };
}

// RealEstateListing por imóvel (JSON-LD) — mesmo schema da Leça do Balio
// (app/leca-do-balio/page.tsx), mas montado a partir dos dados reais no
// Supabase em vez de fixo, já que agora vale pra qualquer imóvel publicado.
function propertyJsonLd(property: Property, coverImage: string, locale: string) {
  const prefix = locale === "pt-PT" ? "" : `/${locale}`;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description ?? undefined,
    url: `https://ruidacruzconsultor.com${prefix}/imoveis/${property.reference}`,
    image: coverImage.startsWith("http") ? coverImage : `https://ruidacruzconsultor.com${coverImage}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.municipality ?? property.zone ?? undefined,
      addressCountry: "PT",
    },
    offers: property.price_on_application
      ? undefined
      : { "@type": "Offer", price: property.price ?? undefined, priceCurrency: "EUR" },
    floorSize: property.construction_area_sqm
      ? { "@type": "QuantitativeValue", value: property.construction_area_sqm, unitCode: "MTK" }
      : undefined,
    lotSize: property.land_area_sqm
      ? { "@type": "QuantitativeValue", value: property.land_area_sqm, unitCode: "MTK" }
      : undefined,
    broker: {
      "@type": "RealEstateAgent",
      name: "Rui Da Cruz",
      telephone: "+351939081583",
    },
  };
}

export default async function ImovelPage({
  params,
}: {
  params: Promise<{ locale: string; referencia: string }>;
}) {
  const { locale, referencia } = await params;
  const isAdmin = await isAdminAuthenticated();
  // Admin vê rascunhos (modo de pré-visualização); visitante público só vê o
  // que passar pela RLS (published = true), que já trata o "não encontrado".
  const property = isAdmin
    ? await getPropertyByReferenceForAdmin(referencia)
    : await getPropertyByReference(referencia);
  if (!property) notFound();

  const photos = await getPropertyPhotos(property.id);
  const floorplans = await getPropertyFloorplans(property.id);
  const coverImage = photos[0]?.storage_path ?? "/images/leca-do-balio/01-hero-fachada.jpg";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd(property, coverImage, locale)) }}
      />
      {isAdmin && !property.published && (
        <div className="bg-accent px-6 py-2 text-center text-xs font-body tracking-[0.08em] uppercase text-background">
          Pré-visualização — este imóvel ainda não está publicado
        </div>
      )}
      <SiteHeader />
      <main className="flex-1">
        <PropertyHero property={property} coverImage={coverImage} />
        {sectionsForMode(property, photos, floorplans)}
        <SiteLeadForm
          property={{ reference: property.reference, title: property.title, zone: property.zone }}
        />
      </main>
      <SiteFooter />
      <SiteWhatsAppFloating />
    </>
  );
}
