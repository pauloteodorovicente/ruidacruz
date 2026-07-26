import { notFound } from "next/navigation";
import { getPropertyByReference } from "@/lib/properties";
import { LanguageProvider } from "@/lib/language-context";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { WhatsAppFloating } from "@/app/components/WhatsAppFloating";

// Fase 5, primeiro output: só a rota + o dado do Supabase chegando.
// Cada seção (Hero, Galeria, Planta, Localização...) vira dinâmica aqui
// uma de cada vez, nos próximos outputs — ver Checklist de Construção.
export default async function ImovelPage({
  params,
}: {
  params: Promise<{ referencia: string }>;
}) {
  const { referencia } = await params;
  const property = await getPropertyByReference(referencia);
  if (!property) notFound();

  return (
    <LanguageProvider>
      <Header />
      <main className="flex-1 bg-background px-6 pt-28 pb-20 md:px-12 md:pt-36">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{property.zone}</p>
          <h1 className="font-display text-3xl md:text-4xl mb-4">{property.title}</h1>
          <p className="text-foreground-muted leading-relaxed">{property.description}</p>
          <p className="mt-6 text-sm text-foreground-muted opacity-70">Ref. {property.reference}</p>
        </div>
      </main>
      <Footer />
      <WhatsAppFloating />
    </LanguageProvider>
  );
}
