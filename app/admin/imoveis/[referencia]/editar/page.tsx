import { redirect, notFound } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPropertyByReference, getPropertyPhotos } from "@/lib/properties";
import { PropertyForm } from "../../../PropertyForm";
import { PhotoManager } from "../../../PhotoManager";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ referencia: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { referencia } = await params;
  const property = await getPropertyByReference(referencia);
  if (!property) notFound();

  const photos = await getPropertyPhotos(property.id);

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-2xl flex flex-col gap-10">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-1">Painel Administrativo</p>
          <h1 className="font-display text-2xl">Editar — {property.title}</h1>
        </div>
        <PhotoManager propertyId={property.id} propertyReference={property.reference} photos={photos} />
        <PropertyForm property={property} />
      </div>
    </main>
  );
}
