"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
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

export function CuratedCollection({ properties }: { properties: Property[] }) {
  const { t, locale } = useLanguage();
  const c = t.home.collection;

  return (
    <section id="colecao" className="bg-background px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="block">
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{c.eyebrow}</p>
          <h2 className="font-display text-3xl md:text-4xl mb-10">{c.title}</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {properties.map((property) => (
            <Reveal key={property.id} className="block">
              <a href="/leca-do-balio" className="group block">
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
                      ? c.priceOnApplication
                      : property.price?.toLocaleString(locale === "pt" ? "pt-PT" : "en-US", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 0,
                        })}
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
