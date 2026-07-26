import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/language-context";
import { Header } from "@/app/components/Header";
import { HomeHero } from "@/app/components/HomeHero";
import { WhatsAppFloating } from "@/app/components/WhatsAppFloating";
import { Footer } from "@/app/components/Footer";
import { MetaPixel } from "@/app/components/MetaPixel";

export const metadata: Metadata = {
  title: "Rui Da Cruz | Consultoria Imobiliária Premium — Lisboa e Porto",
  description:
    "Rui Da Cruz representa uma coleção reduzida de propriedades em Lisboa, Cascais e no Porto — cada uma escolhida a dedo, nunca apenas listada.",
};

export default function HomePage() {
  return (
    <LanguageProvider>
      <MetaPixel />
      <Header />
      <main className="flex-1">
        <HomeHero />
        {/* Próximos outputs (Fase 4): tira de credibilidade, coleção curada,
            apresentação do Rui, depoimentos — ver Checklist de Construção. */}
      </main>
      <Footer />
      <WhatsAppFloating />
    </LanguageProvider>
  );
}
