"use client";

import Image from "next/image";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "./Reveal";
import type { Property } from "@/lib/properties";

// Recebe as propriedades já buscadas no Supabase por um Server Component pai
// (app/page.tsx) — mantém o padrão do site de conteúdo traduzido em Client
// Component, sem duplicar a busca de dados aqui.
//
// TODO (Fase 5/6): imagem hoje é um mapeamento manual por referência — vira
// property_photos do Storage quando o upload no painel existir.
const COVER_IMAGE_BY_REFERENCE: Record<string, string> = {
  "122481641-38": "/images/leca-do-balio/01-hero-fachada.jpg",
  verdelago: "/images/verdelago/01-hero-humanizada.jpg",
};
const COVER_IMAGE_POSITION: Record<string, string> = {
  verdelago: "object-[center_22%]",
};

export function CuratedCollection({
  properties,
  viewAllHref,
  hideHeading,
}: {
  properties: Property[];
  viewAllHref?: string;
  hideHeading?: boolean;
}) {
  const locale = useLocale();
  const c = useTranslations("home.collection");

  return (
    <section id="colecao" className="bg-background px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        {!hideHeading && (
          <Reveal className="block">
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{c("eyebrow")}</p>
            <h2 className="font-display text-3xl md:text-4xl mb-10">{c("title")}</h2>
          </Reveal>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {properties.map((property) => {
            // Landings de campanha (Leça, Verdelago) têm rota própria fora do
            // template genérico de imóvel; o resto usa a ficha /imoveis/[ref].
            const href = property.is_campaign_page && property.campaign_path
              ? property.campaign_path
              : `/imoveis/${property.reference}`;
            return (
              <Reveal key={property.id} className="block">
                <NextLink
                  href={href}
                  className="group block overflow-hidden rounded-lg border border-border bg-background-raised shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.35)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={COVER_IMAGE_BY_REFERENCE[property.reference] ?? "/images/leca-do-balio/01-hero-fachada.jpg"}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={`object-cover transition-transform duration-700 group-hover:scale-[1.05] ${COVER_IMAGE_POSITION[property.reference] ?? ""}`}
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs tracking-[0.15em] uppercase text-foreground-muted">{property.zone}</p>
                    <p className="font-display text-lg mt-1">{property.title}</p>
                    <p className="mt-1 text-sm text-accent">
                      {property.price_on_application
                        ? c("priceOnApplication")
                        : property.price?.toLocaleString(locale, {
                            style: "currency",
                            currency: "EUR",
                            maximumFractionDigits: 0,
                          })}
                    </p>
                  </div>
                </NextLink>
              </Reveal>
            );
          })}
        </div>

        {viewAllHref && (
          <Reveal className="block mt-12 text-center">
            <NextLink
              href={viewAllHref}
              className="inline-block text-xs tracking-[0.15em] uppercase text-accent border-b border-accent/40 pb-1 transition-colors hover:text-accent-strong hover:border-accent-strong"
            >
              {c("viewAll")}
            </NextLink>
          </Reveal>
        )}
      </div>
    </section>
  );
}
