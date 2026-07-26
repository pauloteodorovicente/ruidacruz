import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/language-context";
import { Header } from "@/app/components/Header";
import { HomeHero } from "@/app/components/HomeHero";
import { CredibilityStrip } from "@/app/components/CredibilityStrip";
import { CuratedCollection } from "@/app/components/CuratedCollection";
import { AboutRui } from "@/app/components/AboutRui";
import { Testimonials } from "@/app/components/Testimonials";
import { WhatsAppFloating } from "@/app/components/WhatsAppFloating";
import { Footer } from "@/app/components/Footer";
import { MetaPixel } from "@/app/components/MetaPixel";
import { getProperties } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Rui Da Cruz | Consultoria Imobiliária Premium — Lisboa e Porto",
  description:
    "Rui Da Cruz representa uma coleção reduzida de propriedades em Lisboa, Cascais e no Porto — cada uma escolhida a dedo, nunca apenas listada.",
};

export default async function HomePage() {
  const properties = await getProperties();

  return (
    <LanguageProvider>
      <MetaPixel />
      <Header />
      <main className="flex-1">
        <HomeHero />
        <CredibilityStrip />
        <CuratedCollection properties={properties} />
        <AboutRui />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppFloating />
    </LanguageProvider>
  );
}
