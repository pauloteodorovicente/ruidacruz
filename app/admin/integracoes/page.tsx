import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getMetaPixelSettings,
  getGhlSettings,
  getSchedulingSettings,
  getHomeCollectionSettings,
  getSellerCtaSettings,
} from "@/lib/settings";
import { MetaPixelForm } from "./MetaPixelForm";
import { GhlForm } from "./GhlForm";
import { SchedulingForm } from "./SchedulingForm";
import { HomeCollectionForm } from "./HomeCollectionForm";
import { SellerCtaForm } from "./SellerCtaForm";

export const PIXEL_PAGE_OPTIONS = [
  { value: "/", label: "Home" },
  { value: "/imoveis", label: "Ficha de Imóvel (genérica)" },
  { value: "/portfolio", label: "Portfólio" },
  { value: "/sobre", label: "Sobre" },
  { value: "/contacto", label: "Contacto" },
  { value: "/leca-do-balio", label: "Leça do Balio" },
  { value: "/verdelago", label: "Verdelago" },
  { value: "/portimao-praia-da-rocha", label: "Portimão — Praia da Rocha" },
  { value: "/onegreenway", label: "One Green Way" },
];

export default async function IntegracoesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [pixel, ghl, scheduling, homeCollection, sellerCta] = await Promise.all([
    getMetaPixelSettings(),
    getGhlSettings(),
    getSchedulingSettings(),
    getHomeCollectionSettings(),
    getSellerCtaSettings(),
  ]);

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl mb-2">Integrações</h1>
        <p className="text-sm text-foreground-muted mb-10">
          Configure aqui, sem precisar mexer em código.
        </p>
        <div className="flex flex-col gap-10">
          <MetaPixelForm initial={pixel} pageOptions={PIXEL_PAGE_OPTIONS} />
          <GhlForm initial={ghl} />
          <SchedulingForm initial={scheduling} />
          <HomeCollectionForm initial={homeCollection} />
          <SellerCtaForm initial={sellerCta} />
        </div>
      </div>
    </main>
  );
}
