import { notFound } from "next/navigation";
import { getPropertyByReference, getPropertyPhotos } from "@/lib/properties";
import { getPropertyByReferenceForAdmin } from "@/lib/admin-properties";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { LanguageProvider } from "@/lib/language-context";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { WhatsAppFloating } from "@/app/components/WhatsAppFloating";
import { PropertyHero } from "@/app/components/PropertyHero";
import { PropertyDetails } from "@/app/components/PropertyDetails";
import { PropertyHighlights } from "@/app/components/PropertyHighlights";
import { PropertyGallery } from "@/app/components/PropertyGallery";
import { PropertyLocation } from "@/app/components/PropertyLocation";
import { ArchitectCredit } from "@/app/components/ArchitectCredit";
import { LeadForm } from "@/app/components/LeadForm";
import type { Property, PropertyPhoto } from "@/lib/properties";
import type { ReactNode } from "react";

// Os 3 modos de layout reordenam/adicionam seções pra dar destaque ao que
// mais importa naquele tipo de imóvel — Arquitetura destaca quem assinou o
// projeto, Paisagem/Terreno e Urbano adiantam a Localização, só que com
// enquadramentos diferentes (jardim/terreno vs. vizinhança/cidade).
function sectionsForMode(property: Property, photos: PropertyPhoto[]): ReactNode[] {
  const details = <PropertyDetails property={property} key="details" />;
  const highlights = <PropertyHighlights property={property} key="highlights" />;
  const gallery = <PropertyGallery photos={photos} alt={property.title} key="gallery" />;
  const location = <PropertyLocation property={property} key="location" />;

  switch (property.layout_mode) {
    case "arquitetura":
      return [details, <ArchitectCredit property={property} key="architect" />, highlights, gallery, location];
    case "paisagem_terreno":
      return [details, highlights, location, gallery];
    case "urbano":
      return [details, location, highlights, gallery];
  }
}

// Fase 5: template genérico de imóvel. Ainda faltam (próximos outputs):
// planta, e a galeria com lightbox completo (essa versão é só um grid) —
// ver Checklist de Construção.
export default async function ImovelPage({
  params,
}: {
  params: Promise<{ referencia: string }>;
}) {
  const { referencia } = await params;
  const isAdmin = await isAdminAuthenticated();
  // Admin vê rascunhos (modo de pré-visualização); visitante público só vê o
  // que passar pela RLS (published = true), que já trata o "não encontrado".
  const property = isAdmin
    ? await getPropertyByReferenceForAdmin(referencia)
    : await getPropertyByReference(referencia);
  if (!property) notFound();

  const photos = await getPropertyPhotos(property.id);
  const coverImage = photos[0]?.storage_path ?? "/images/leca-do-balio/01-hero-fachada.jpg";

  return (
    <LanguageProvider>
      {isAdmin && !property.published && (
        <div className="bg-accent px-6 py-2 text-center text-xs font-body tracking-[0.08em] uppercase text-background">
          Pré-visualização — este imóvel ainda não está publicado
        </div>
      )}
      <Header />
      <main className="flex-1">
        <PropertyHero property={property} coverImage={coverImage} />
        {sectionsForMode(property, photos)}
        <LeadForm
          property={{ reference: property.reference, title: property.title, zone: property.zone }}
        />
      </main>
      <Footer />
      <WhatsAppFloating />
    </LanguageProvider>
  );
}
