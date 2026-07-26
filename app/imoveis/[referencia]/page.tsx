import { notFound } from "next/navigation";
import { getPropertyByReference, getPropertyPhotos } from "@/lib/properties";
import { LanguageProvider } from "@/lib/language-context";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { WhatsAppFloating } from "@/app/components/WhatsAppFloating";
import { PropertyHero } from "@/app/components/PropertyHero";
import { PropertyDetails } from "@/app/components/PropertyDetails";
import { PropertyHighlights } from "@/app/components/PropertyHighlights";
import { PropertyGallery } from "@/app/components/PropertyGallery";
import { PropertyLocation } from "@/app/components/PropertyLocation";
import { LeadForm } from "@/app/components/LeadForm";

// Fase 5: template genérico de imóvel. Ainda faltam (próximos outputs): os
// 3 modos de layout, planta, e a galeria com lightbox completo (essa versão
// é só um grid) — ver Checklist de Construção.
export default async function ImovelPage({
  params,
}: {
  params: Promise<{ referencia: string }>;
}) {
  const { referencia } = await params;
  const property = await getPropertyByReference(referencia);
  if (!property) notFound();

  const photos = await getPropertyPhotos(property.id);
  const coverImage = photos[0]?.storage_path ?? "/images/leca-do-balio/01-hero-fachada.jpg";

  return (
    <LanguageProvider>
      <Header />
      <main className="flex-1">
        <PropertyHero property={property} coverImage={coverImage} />
        <PropertyDetails property={property} />
        <PropertyHighlights property={property} />
        <PropertyGallery photos={photos} alt={property.title} />
        <PropertyLocation property={property} />
        <LeadForm
          property={{ reference: property.reference, title: property.title, zone: property.zone }}
        />
      </main>
      <Footer />
      <WhatsAppFloating />
    </LanguageProvider>
  );
}
