import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/locale-alternates";
import { getSellerCtaSettings } from "@/lib/settings";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { VenderLeadForm } from "./VenderLeadForm";
import { BUSINESS_INFO } from "@/lib/business-info";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vender.meta" });
  const title = t("title");
  const description = t("description");
  return {
    title,
    description,
    alternates: { languages: localeAlternates("/vender") },
    openGraph: {
      title,
      description,
      images: ["/images/rui/hero-portrait.jpg"],
      type: "website",
    },
  };
}

// Pedido do Rui via WhatsApp (13/08): um ponto de entrada em destaque no
// menu pra quem quer VENDER um imóvel, não comprar — hoje todo o site é
// voltado pro comprador. Página própria + tag distinta no GHL
// (site-vender-imovel), reaproveitando o mesmo SiteLeadForm genérico do
// /contacto. Desligável pelo admin (/admin/integracoes) — desligado, a
// própria rota some (não só o link do menu).
export default async function VenderPage() {
  const { enabled } = await getSellerCtaSettings();
  if (!enabled) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 pt-32 pb-20">
        <VenderLeadForm />
        <p className="text-center text-xs text-foreground-muted mt-8 px-6">
          {BUSINESS_INFO.brand} · {BUSINESS_INFO.streetAddress}, {BUSINESS_INFO.postalCode} {BUSINESS_INFO.addressLocality}{" "}
          · {BUSINESS_INFO.phoneDisplay}
        </p>
      </main>
      <SiteFooter />
      <SiteWhatsAppFloating />
      <ScheduleCallFloating />
    </>
  );
}
