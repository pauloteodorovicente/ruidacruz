import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/locale-alternates";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { ContactoLeadForm } from "./ContactoLeadForm";
import { BUSINESS_INFO } from "@/lib/business-info";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contacto.meta" });
  const title = t("title");
  const description = t("description");
  return {
    title,
    description,
    alternates: { languages: localeAlternates("/contacto") },
    openGraph: {
      title,
      description,
      images: ["/images/rui/hero-portrait.jpg"],
      type: "website",
    },
  };
}

export default function ContactoPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pt-32 pb-20">
        {/* Referência distinta de qualquer imóvel real — fica "sem imóvel
            associado" no dashboard de analytics, corretamente, já que é uma
            pergunta geral, não sobre uma propriedade específica. */}
        <ContactoLeadForm />
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
