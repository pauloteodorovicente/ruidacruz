import type { Metadata } from "next";
import { VerdelagoLanguageProvider } from "@/lib/verdelago-language-context";
import { VerdelagoHeader } from "@/app/components/verdelago/VerdelagoHeader";
import { VerdelagoHero } from "@/app/components/verdelago/VerdelagoHero";
import { VerdelagoOverview } from "@/app/components/verdelago/VerdelagoOverview";
import { VerdelagoNarrative } from "@/app/components/verdelago/VerdelagoNarrative";
import { VerdelagoAmenities } from "@/app/components/verdelago/VerdelagoAmenities";
import { VerdelagoLifestyle } from "@/app/components/verdelago/VerdelagoLifestyle";
import { VerdelagoGallery } from "@/app/components/verdelago/VerdelagoGallery";
import { VerdelagoFloorPlans } from "@/app/components/verdelago/VerdelagoFloorPlans";
import { VerdelagoInvestment } from "@/app/components/verdelago/VerdelagoInvestment";
import { VerdelagoCertification } from "@/app/components/verdelago/VerdelagoCertification";
import { VerdelagoLocation } from "@/app/components/verdelago/VerdelagoLocation";
import { VerdelagoRelated } from "@/app/components/verdelago/VerdelagoRelated";
import { VerdelagoLeadForm } from "@/app/components/verdelago/VerdelagoLeadForm";
import { VerdelagoWhatsApp } from "@/app/components/verdelago/VerdelagoWhatsApp";
import { VerdelagoFooter } from "@/app/components/verdelago/VerdelagoFooter";

// Rota só de avaliação — não linkada de lugar nenhum, não indexada, não é a
// página real do Verdelago (essa continua em /verdelago, intocada). Mostra
// as seções novas propostas em 05/08 (Investimento, Estilo de Vida,
// Certificação, Relacionados) já encaixadas no layout atual, pro Paulo ver
// em prática antes de decidir quais entram de vez e viram toggle no Admin.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function VerdelagoPreviewPage() {
  return (
    <VerdelagoLanguageProvider>
      <VerdelagoHeader />
      <main className="flex-1">
        <VerdelagoHero />
        <VerdelagoOverview />
        <VerdelagoNarrative />
        <VerdelagoAmenities />
        <VerdelagoLifestyle />
        <VerdelagoGallery />
        <VerdelagoFloorPlans />
        <VerdelagoInvestment />
        <VerdelagoCertification />
        <VerdelagoLocation />
        <VerdelagoRelated />
        <VerdelagoLeadForm />
      </main>
      <VerdelagoWhatsApp />
      <VerdelagoFooter />
    </VerdelagoLanguageProvider>
  );
}
