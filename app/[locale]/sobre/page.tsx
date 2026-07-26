import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { SobreContent } from "./SobreContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sobre.meta" });
  return { title: t("title"), description: t("description") };
}

export default function SobrePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="relative aspect-[4/3] w-full max-w-xs mx-auto mb-10 overflow-hidden">
            <Image src="/images/rui/hero-portrait.jpg" alt="Rui Da Cruz" fill sizes="320px" className="object-cover" />
          </div>
          <SobreContent />
        </div>
      </main>
      <SiteFooter />
      <SiteWhatsAppFloating />
    </>
  );
}
