import { redirect, notFound } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPropertyByReferenceForAdmin } from "@/lib/admin-properties";
import { getPropertyPhotos, getPropertyFloorplans } from "@/lib/properties";
import { PropertyForm } from "../../../PropertyForm";
import { PhotoManager } from "../../../PhotoManager";
import { FloorplanManager } from "../../../FloorplanManager";

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

  const [photos, floorplans] = await Promise.all([
    getPropertyPhotos(property.id),
    getPropertyFloorplans(property.id),
  ]);

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-2xl flex flex-col gap-10">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-1">Painel Administrativo</p>
          <h1 className="font-display text-2xl">Editar — {property.title}</h1>
        </div>
        <PhotoManager propertyId={property.id} propertyReference={property.reference} photos={photos} />
        <FloorplanManager propertyId={property.id} propertyReference={property.reference} floorplans={floorplans} />
        <PropertyForm property={property} />
      </div>
    </main>
  );
}
