import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { SiteLeadForm } from "@/app/components/site/SiteLeadForm";
import { getPropertyPhotos } from "@/lib/properties";
import type { OffMarketTeaser as OffMarketTeaserData } from "@/lib/admin-properties";

// Ficha "Fora de Mercado" — nunca mostra preço, endereço exato, descrição
// completa, plantas ou galeria; só o essencial pra despertar interesse (1
// foto de capa, zona, tipo) mais o formulário de pedido de acesso. Depois
// que o Rui avaliar o pedido (aparece como lead normal no admin/GHL, com a
// tag do próprio imóvel), a liberação é manual: gerar um link de
// pré-visualização (Fase 18) pra esse imóvel e enviar direto pra pessoa —
// esse link já funciona pra imóveis off_market sem precisar de nada novo.
export async function OffMarketTeaser({ teaser, locale }: { teaser: OffMarketTeaserData; locale: string }) {
  const [photos, p] = await Promise.all([
    getPropertyPhotos(teaser.id),
    getTranslations({ locale, namespace: "property" }),
  ]);
  const coverImage = photos[0]?.storage_path;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 pt-24">
        <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden bg-black">
          {coverImage && (
            <Image src={coverImage} alt={teaser.title} fill sizes="100vw" className="object-cover opacity-60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-3">Fora de Mercado</p>
            <h1 className="font-display text-2xl md:text-4xl mb-2">{teaser.title}</h1>
            <p className="text-sm text-white/70">
              {teaser.zone ?? p(`propertyTypeTags.${teaser.property_type}`)}
              {teaser.municipality ? ` · ${teaser.municipality}` : ""}
              {teaser.typology ? ` · ${teaser.typology}` : ""}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <p className="font-body text-base leading-relaxed text-foreground-muted">
            Este imóvel está disponível apenas mediante pedido de acesso. Preencha os seus dados abaixo — entramos
            em contacto para perceber se faz sentido para si e, se sim, partilhamos os detalhes completos.
          </p>
        </div>

        <SiteLeadForm
          property={{ reference: teaser.reference, title: teaser.title, zone: teaser.zone }}
          heading={{
            eyebrow: "Fora de Mercado",
            title: "Pedir Acesso",
            subtitle: "Sem compromisso — respondemos em poucas horas.",
            submitLabel: "Pedir Acesso",
          }}
        />
      </main>
      <SiteFooter />
      <SiteWhatsAppFloating />
    </>
  );
}
