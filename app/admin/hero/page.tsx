import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getHomeHero } from "@/lib/home-hero";
import { getAllPropertyPhotosForGallery } from "@/lib/admin-gallery";
import { HeroEditor } from "./HeroEditor";
import { saveHomeHero } from "../hero-actions";

export default async function HeroAdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [hero, galleryPhotos] = await Promise.all([getHomeHero(), getAllPropertyPhotosForGallery()]);

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl mb-3">Hero da Home</h1>
        <p className="text-sm text-foreground-muted mb-10 max-w-lg">
          Escolha entre uma foto, um mosaico de até 5, ou um vídeo — da galeria de qualquer imóvel (mesmo não publicado),
          enviando do computador, ou colando um link direto. Arraste na prévia pra reposicionar, use o zoom, e arraste os
          quadros pra reordenar o mosaico.
        </p>
        <HeroEditor initial={hero} galleryPhotos={galleryPhotos} onSave={saveHomeHero} />
      </div>
    </main>
  );
}
