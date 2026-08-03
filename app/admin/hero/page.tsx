import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getHomeHero } from "@/lib/home-hero";
import { getAllPropertyPhotosForGallery } from "@/lib/admin-gallery";
import { HeroEditor } from "./HeroEditor";
import { AdminBrand } from "../AdminBrand";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default async function HeroAdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [hero, galleryPhotos] = await Promise.all([getHomeHero(), getAllPropertyPhotosForGallery()]);

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-y-3 mb-3">
          <div>
            <AdminBrand />
            <h1 className="font-display text-2xl">Hero da Home</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors">
              ← Voltar
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <p className="text-sm text-foreground-muted mb-10 max-w-lg">
          Escolha entre uma foto, um mosaico de até 5, ou um vídeo — da galeria de qualquer imóvel (mesmo não publicado),
          enviando do computador, ou colando um link direto. Arraste na prévia pra reposicionar, use o zoom, e arraste os
          quadros pra reordenar o mosaico.
        </p>
        <HeroEditor initial={hero} galleryPhotos={galleryPhotos} />
      </div>
    </main>
  );
}
