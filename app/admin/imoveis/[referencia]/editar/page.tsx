import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPropertyByReferenceForAdmin } from "@/lib/admin-properties";
import { getPropertyPhotos, getPropertyFloorplans } from "@/lib/properties";
import { getPropertyHero } from "@/lib/property-hero";
import { LEGACY_COVER_BY_REFERENCE } from "@/lib/cover";
import { getPropertyTypologies, getTypologyFloorplans, getPropertyUnits } from "@/lib/property-typologies";
import { PropertyForm } from "../../../PropertyForm";
import { PhotoManager } from "../../../PhotoManager";
import { SectionOrderEditor } from "../../../SectionOrderEditor";
import { FloorplanManager } from "../../../FloorplanManager";
import { TypologyManager } from "../../../TypologyManager";
import { UnitsManager } from "../../../UnitsManager";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ referencia: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { referencia } = await params;
  // Via admin (service role) — não a leitura pública: um imóvel recém-criado
  // nasce em rascunho (published = false) e a RLS pública nunca o acharia
  // aqui, travando a edição do próprio imóvel que acabou de ser criado.
  const property = await getPropertyByReferenceForAdmin(referencia);
  if (!property) notFound();

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-y-3">
      <h1 className="font-display text-2xl">Editar — {property.title}</h1>
      <Link
        href={`/admin/imoveis/${property.reference}/hero`}
        className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors"
      >
        Hero deste imóvel
      </Link>
    </div>
  );

  const [photos, floorplans, typologies, units, hero] = await Promise.all([
    getPropertyPhotos(property.id),
    getPropertyFloorplans(property.id),
    getPropertyTypologies(property.id),
    getPropertyUnits(property.id),
    getPropertyHero(property.id),
  ]);
  const typologyFloorplans = await getTypologyFloorplans(typologies.map((t) => t.id));

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-2xl flex flex-col gap-10">
        {header}
        <PhotoManager
          propertyId={property.id}
          propertyReference={property.reference}
          photos={photos}
          coverPhotoId={property.cover_photo_id}
          legacyCover={LEGACY_COVER_BY_REFERENCE[property.reference] ?? null}
          hasHeroVideo={hero?.media_type === "video"}
          galleryFeatured={property.gallery_featured}
          galleryVideoInGrid={property.gallery_video_in_grid}
        />
        {!property.is_campaign_page && (
          <SectionOrderEditor
            propertyId={property.id}
            propertyReference={property.reference}
            layoutMode={property.layout_mode}
            savedOrder={property.section_order}
          />
        )}
        <FloorplanManager propertyId={property.id} propertyReference={property.reference} floorplans={floorplans} />
        {property.is_campaign_page && (
          <>
            <TypologyManager
              propertyId={property.id}
              propertyReference={property.reference}
              campaignPath={property.campaign_path}
              typologies={typologies}
              floorplans={typologyFloorplans}
            />
            <UnitsManager
              propertyId={property.id}
              propertyReference={property.reference}
              campaignPath={property.campaign_path}
              units={units}
              typologies={typologies}
            />
          </>
        )}
        <PropertyForm property={property} />
      </div>
    </main>
  );
}
