import type { Metadata } from "next";
import Image from "next/image";
import { LanguageProvider } from "@/lib/language-context";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { WhatsAppFloating } from "@/app/components/WhatsAppFloating";
import { SobreContent } from "./SobreContent";

export const metadata: Metadata = {
  title: "Sobre Rui Da Cruz | Consultor Imobiliário — RE/MAX Collection",
  description:
    "Consultor imobiliário certificado RE/MAX Collection, com atuação em Parque das Nações, Lisboa, Cascais e Porto.",
};

export default function SobrePage() {
  return (
    <LanguageProvider>
      <Header />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="relative aspect-[4/3] w-full max-w-xs mx-auto mb-10 overflow-hidden">
            <Image src="/images/rui/hero-portrait.jpg" alt="Rui Da Cruz" fill sizes="320px" className="object-cover" />
          </div>
          <SobreContent />
        </div>
      </main>
      <Footer />
      <WhatsAppFloating />
    </LanguageProvider>
  );
}
