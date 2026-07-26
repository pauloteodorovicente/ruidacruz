import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/language-context";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { WhatsAppFloating } from "@/app/components/WhatsAppFloating";
import { ContactoLeadForm } from "./ContactoLeadForm";

export const metadata: Metadata = {
  title: "Contacto | Rui Da Cruz — Consultor Imobiliário",
  description: "Fale diretamente com Rui Da Cruz — resposta em poucas horas.",
};

export default function ContactoPage() {
  return (
    <LanguageProvider>
      <Header />
      <main className="flex-1 pt-32 pb-20">
        {/* Referência distinta de qualquer imóvel real — fica "sem imóvel
            associado" no dashboard de analytics, corretamente, já que é uma
            pergunta geral, não sobre uma propriedade específica. */}
        <ContactoLeadForm />
      </main>
      <Footer />
      <WhatsAppFloating />
    </LanguageProvider>
  );
}
