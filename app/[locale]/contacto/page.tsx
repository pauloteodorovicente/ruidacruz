import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { ContactoLeadForm } from "./ContactoLeadForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contacto.meta" });
  return { title: t("title"), description: t("description") };
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
      </main>
      <SiteFooter />
      <SiteWhatsAppFloating />
    </>
  );
}
