import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPropertyByReferenceForAdmin } from "@/lib/admin-properties";
import { getPropertyHero } from "@/lib/property-hero";
import { getAllPropertyPhotosForGallery } from "@/lib/admin-gallery";
import { HeroEditor } from "../../../hero/HeroEditor";
import { savePropertyHero } from "../hero-actions";
import { AdminBrand } from "../../../AdminBrand";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default async function PropertyHeroAdminPage({
  params,
}: {
  params: Promise<{ referencia: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { referencia } = await params;
  const property = await getPropertyByReferenceForAdmin(referencia);
  if (!property) notFound();

  const [hero, galleryPhotos] = await Promise.all([
    getPropertyHero(property.id),
    getAllPropertyPhotosForGallery(),
  ]);

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-y-3 mb-3">
          <div>
            <AdminBrand />
            <h1 className="font-display text-2xl">Hero — {property.title}</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href={`/admin/imoveis/${property.reference}/editar`}
              className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors"
            >
              ← Voltar
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <p className="text-sm text-foreground-muted mb-10 max-w-lg">
          Sem nada configurado aqui, a página deste imóvel continua usando a primeira foto enviada como hero simples.
          Configure abaixo pra usar o mesmo hero em mosaico/vídeo com zoom e reposicionamento da Home, só que
          específico deste imóvel.
        </p>
        <HeroEditor
          initial={hero}
          galleryPhotos={galleryPhotos}
          onSave={(mediaType, layout, items) => savePropertyHero(property.id, property.reference, mediaType, layout, items)}
        />
      </div>
    </main>
  );
}
