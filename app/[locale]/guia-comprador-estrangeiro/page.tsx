import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/locale-alternates";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { GuiaContent } from "./GuiaContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guiaCompradorEstrangeiro.meta" });
  const title = t("title");
  const description = t("description");
  return {
    title,
    description,
    alternates: { languages: localeAlternates("/guia-comprador-estrangeiro") },
    openGraph: { title, description, images: ["/images/rui/hero-portrait.jpg"], type: "website" },
  };
}

export default function GuiaCompradorEstrangeiroPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-12">
        <div className="mx-auto max-w-3xl">
          <GuiaContent />
        </div>
      </main>
      <SiteFooter />
      <SiteWhatsAppFloating />
      <ScheduleCallFloating />
    </>
  );
}
