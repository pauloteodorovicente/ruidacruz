import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getPropertyByReference } from "@/lib/properties";
import { getSellerCtaSettings } from "@/lib/settings";
import { localeAlternates, localizedUrl } from "@/lib/locale-alternates";
import { OG_LOCALE } from "@/lib/campaign-i18n";
import { content } from "@/lib/portimao-content";
import { PortimaoLanguageProvider } from "@/lib/portimao-language-context";
import { PortimaoHeader } from "@/app/components/portimao/PortimaoHeader";
import { PortimaoHero } from "@/app/components/portimao/PortimaoHero";
import { PortimaoIdentification } from "@/app/components/portimao/PortimaoIdentification";
import { PortimaoNarrative } from "@/app/components/portimao/PortimaoNarrative";
import { PortimaoAmenities } from "@/app/components/portimao/PortimaoAmenities";
import { PortimaoGallery } from "@/app/components/portimao/PortimaoGallery";
import { PortimaoPricing } from "@/app/components/portimao/PortimaoPricing";
import { PortimaoLeadForm } from "@/app/components/portimao/PortimaoLeadForm";
import { PortimaoWhatsApp } from "@/app/components/portimao/PortimaoWhatsApp";
import { PagePalette } from "@/app/components/site/PagePalette";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { PortimaoFooter } from "@/app/components/portimao/PortimaoFooter";

// Caminho sem prefixo de idioma — pt-PT fica em /portimao-praia-da-rocha (a
// URL de sempre) e os outros 6 em /en/portimao-praia-da-rocha, /es/...
const PATH = "/portimao-praia-da-rocha";
const OG_IMAGE = "/images/portimao-praia-rocha/Apart T1 Praia_Rocha_10.jpeg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const { title, description } = content[locale].meta;

  return {
    title,
    description,
    alternates: { canonical: localizedUrl(locale, PATH), languages: localeAlternates(PATH) },
    openGraph: {
      title,
      description,
      images: [OG_IMAGE],
      locale: OG_LOCALE[locale],
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

// Descrição em português mantida como era (texto próprio do schema); nos
// outros idiomas usa a descrição da página, já traduzida.
const JSON_LD_DESCRIPTION_PT =
  "Apartamento T1 para arrendamento semanal, Edifício Alto da Foz, Praia da Rocha, Portimão.";

function buildJsonLd(locale: (typeof routing.locales)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Apartamento T1 Praia da Rocha",
    description: locale === "pt-PT" ? JSON_LD_DESCRIPTION_PT : content[locale].meta.description,
    inLanguage: locale,
    url: localizedUrl(locale, PATH),
    image: `https://ruidacruzconsultor.com${OG_IMAGE}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Estrada da Rocha — Edifício Alto da Foz, São Francisco 18",
      addressLocality: "Portimão",
      postalCode: "8500-804",
      addressCountry: "PT",
    },
  };
}

export default async function PortimaoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // Controle de publicação vem do registo em properties (ref
  // "portimao-praia-da-rocha") — mesmo padrão da Leça e do Verdelago.
  const property = await getPropertyByReference("portimao-praia-da-rocha");
  if (!property?.published) notFound();
  const { enabled: sellerCtaEnabled } = await getSellerCtaSettings();

  return (
    <PortimaoLanguageProvider locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(locale)) }} />
      <PagePalette slug={property.color_theme} />
      <PortimaoHeader sellerCtaEnabled={sellerCtaEnabled} />
      <main className="flex-1">
        <PortimaoHero />
        <PortimaoIdentification />
        <PortimaoNarrative />
        <PortimaoAmenities />
        <PortimaoGallery />
        <PortimaoPricing />
        <PortimaoLeadForm />
      </main>
      <PortimaoWhatsApp />
      <ScheduleCallFloating />
      <PortimaoFooter sellerCtaEnabled={sellerCtaEnabled} />
    </PortimaoLanguageProvider>
  );
}
