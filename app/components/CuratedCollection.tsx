"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "./Reveal";
import { FavoriteButton } from "./FavoriteButton";
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
  "portimao-praia-da-rocha": "/images/portimao-praia-rocha/Apart T1 Praia_Rocha_10.jpeg",
  onegreenway: "/images/onegreenway/hero-1.jpg",
};
const COVER_IMAGE_POSITION: Record<string, string> = {
  verdelago: "object-[center_22%]",
};

const AUTOPLAY_PX_PER_SEC = 26;
const DRAG_CLICK_SUPPRESS_THRESHOLD = 6;

function hrefFor(property: Property) {
  // Landings de campanha (Leça, Verdelago) têm rota própria fora do
  // template genérico de imóvel; o resto usa a ficha /imoveis/[ref].
  return property.is_campaign_page && property.campaign_path
    ? property.campaign_path
    : `/imoveis/${property.reference}`;
}

function PropertyCard({
  property,
  locale,
  c,
  p,
  onDragClick,
}: {
  property: Property;
  locale: string;
  c: (key: string) => string;
  p: (key: string) => string;
  onDragClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <NextLink
      href={hrefFor(property)}
      onClick={onDragClick}
      className="group block overflow-hidden rounded-lg border border-border bg-background-raised shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={COVER_IMAGE_BY_REFERENCE[property.reference] ?? "/images/leca-do-balio/01-hero-fachada.jpg"}
          alt={property.title}
          fill
          draggable={false}
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover transition-transform duration-700 group-hover:scale-[1.05] ${COVER_IMAGE_POSITION[property.reference] ?? ""}`}
        />
        <FavoriteButton propertyId={property.id} className="absolute top-3 right-3 z-10" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs tracking-[0.15em] uppercase text-foreground-muted">{property.zone}</p>
          <span className="shrink-0 text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 border border-accent/40 text-accent">
            {p(`businessTypeTags.${property.business_type}`)}
          </span>
        </div>
        <p className="font-display text-lg mt-1">{property.title}</p>
        <p className="mt-1 text-sm text-accent">
          {property.price_on_application
            ? c("priceOnApplication")
            : property.price?.toLocaleString(locale, {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              })}
          {!property.price_on_application &&
            property.business_type === "arrendamento" &&
            !property.is_campaign_page && <span className="text-foreground-muted">{p("perMonth")}</span>}
        </p>
      </div>
    </NextLink>
  );
}

// Carrossel infinito — pedido do Paulo (10/08): a grade fixa não escala bem
// além de uns poucos imóveis em destaque. Duplica a lista uma vez (loop
// visual contínuo), anda sozinho devagar via requestAnimationFrame, pausa
// no hover/drag, e aceita arrastar (Pointer Events, mesmo padrão unificado
// mouse+toque de PropertyNavArrows/ZoomableImage). Não ativa autoplay se o
// visitante pedir menos movimento.
function CarouselCollection({
  properties,
  locale,
  c,
  p,
}: {
  properties: Property[];
  locale: string;
  c: (key: string) => string;
  p: (key: string) => string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const dragState = useRef<{ startX: number; startScroll: number; moved: boolean } | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf: number;
    let last = performance.now();
    function step(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused && track) {
        const setWidth = track.scrollWidth / 2;
        track.scrollLeft += AUTOPLAY_PX_PER_SEC * dt;
        if (track.scrollLeft >= setWidth) track.scrollLeft -= setWidth;
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  function handlePointerDown(e: React.PointerEvent) {
    const track = trackRef.current;
    if (!track) return;
    dragState.current = { startX: e.clientX, startScroll: track.scrollLeft, moved: false };
    setPaused(true);
    try {
      track.setPointerCapture(e.pointerId);
    } catch {
      // captura indisponível — arrasto ainda funciona enquanto o ponteiro segue sobre a faixa
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    const track = trackRef.current;
    const drag = dragState.current;
    if (!track || !drag) return;
    const delta = e.clientX - drag.startX;
    if (Math.abs(delta) > DRAG_CLICK_SUPPRESS_THRESHOLD) drag.moved = true;
    let next = drag.startScroll - delta;
    const setWidth = track.scrollWidth / 2;
    if (next < 0) next += setWidth;
    if (next >= setWidth) next -= setWidth;
    track.scrollLeft = next;
  }

  function handlePointerUp() {
    dragState.current = null;
    setPaused(false);
  }

  function handleCardClick(e: React.MouseEvent) {
    if (dragState.current?.moved) e.preventDefault();
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => !dragState.current && setPaused(false)}
      className="flex gap-6 overflow-x-hidden touch-pan-y cursor-grab active:cursor-grabbing select-none"
    >
      {[...properties, ...properties].map((property, i) => (
        <div key={`${property.id}-${i}`} className="w-[78vw] max-w-[340px] flex-shrink-0 sm:w-[320px]">
          <PropertyCard property={property} locale={locale} c={c} p={p} onDragClick={handleCardClick} />
        </div>
      ))}
    </div>
  );
}

export function CuratedCollection({
  properties,
  viewAllHref,
  hideHeading,
  layout = "grid",
}: {
  properties: Property[];
  viewAllHref?: string;
  hideHeading?: boolean;
  layout?: "grid" | "carousel";
}) {
  const locale = useLocale();
  const c = useTranslations("home.collection");
  const p = useTranslations("property");

  // Carrossel só faz sentido com pelo menos alguns cartões pra rolar —
  // com poucos, cai de volta pra grade automaticamente.
  const useCarousel = layout === "carousel" && properties.length > 2;

  return (
    <section id="colecao" className="bg-background px-6 py-14 md:px-12 md:py-20">
      <div className={useCarousel ? "" : "mx-auto max-w-6xl"}>
        {!hideHeading && (
          <Reveal className={`block ${useCarousel ? "mx-auto max-w-6xl px-6 md:px-12" : ""}`}>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{c("eyebrow")}</p>
            <h2 className="font-display text-3xl md:text-4xl mb-10">{c("title")}</h2>
          </Reveal>
        )}

        {useCarousel ? (
          <CarouselCollection properties={properties} locale={locale} c={c} p={p} />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
            {properties.map((property) => (
              <Reveal key={property.id} className="block">
                <PropertyCard property={property} locale={locale} c={c} p={p} />
              </Reveal>
            ))}
          </div>
        )}

        {viewAllHref && (
          <Reveal className={`block mt-12 text-center ${useCarousel ? "mx-auto max-w-6xl px-6 md:px-12" : ""}`}>
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
