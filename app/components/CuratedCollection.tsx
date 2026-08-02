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
// property_photos do Storage quando o upload no painel existir. TODO (Fase 5):
// o link aponta pra /leca-do-balio hardcoded até a rota /imoveis/[referencia]
// existir.
const COVER_IMAGE_BY_REFERENCE: Record<string, string> = {
  "122481641-38": "/images/leca-do-balio/01-hero-fachada.jpg",
};

// Verdelago é uma landing de campanha própria (/verdelago), fora da tabela
// properties do Supabase — por isso entra aqui como um card fixo, no mesmo
// padrão do card da Leça do Balio, em vez de vir do loop de properties.
const VERDELAGO_CARD: Record<string, { zone: string; title: string; price: string }> = {
  "pt-PT": { zone: "Altura, Algarve", title: "Verdelago Resort", price: "Desde 880.000 €" },
  "pt-BR": { zone: "Altura, Algarve", title: "Verdelago Resort", price: "A partir de € 880.000" },
  en: { zone: "Altura, Algarve", title: "Verdelago Resort", price: "From €880,000" },
  es: { zone: "Altura, Algarve", title: "Verdelago Resort", price: "Desde 880.000 €" },
  fr: { zone: "Altura, Algarve", title: "Verdelago Resort", price: "À partir de 880 000 €" },
  it: { zone: "Altura, Algarve", title: "Verdelago Resort", price: "Da 880.000 €" },
  de: { zone: "Altura, Algarve", title: "Verdelago Resort", price: "Ab 880.000 €" },
};

export function CuratedCollection({ properties }: { properties: Property[] }) {
  const locale = useLocale();
  const c = useTranslations("home.collection");
  const verdelago = VERDELAGO_CARD[locale] ?? VERDELAGO_CARD["pt-PT"];

  return (
    <section id="colecao" className="bg-background px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="block">
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{c("eyebrow")}</p>
          <h2 className="font-display text-3xl md:text-4xl mb-10">{c("title")}</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {properties.map((property) => (
            <Reveal key={property.id} className="block">
              <NextLink href="/leca-do-balio" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={COVER_IMAGE_BY_REFERENCE[property.reference] ?? "/images/leca-do-balio/01-hero-fachada.jpg"}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4">
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
          ))}

          <Reveal className="block">
            <NextLink href="/verdelago" className="group block">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/verdelago/01-hero-humanizada.jpg"
                  alt={verdelago.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-[center_22%] transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4">
                <p className="text-xs tracking-[0.15em] uppercase text-foreground-muted">{verdelago.zone}</p>
                <p className="font-display text-lg mt-1">{verdelago.title}</p>
                <p className="mt-1 text-sm text-accent">{verdelago.price}</p>
              </div>
            </NextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
