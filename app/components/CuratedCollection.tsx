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
// As 4 landings de campanha (Leça, Verdelago, Portimão, One Green Way) não
// usam a tabela property_photos pras próprias fotos (cada uma tem seu
// conteúdo/galeria própria) — por isso continuam com uma capa fixa aqui. Todo
// o resto vem de coverImages (prop), buscado de verdade no Supabase — antes
// era um mapeamento fixo com fallback pra uma foto específica da Leça do
// Balio, então qualquer imóvel novo sem foto (ex. um rascunho recém-criado)
// acabava mostrando a fachada da Leça por engano. Achado 24/08.
const COVER_IMAGE_BY_REFERENCE: Record<string, string> = {
  "122481641-38": "/images/leca-do-balio/01-hero-fachada.jpg",
  verdelago: "/images/verdelago/01-hero-humanizada.jpg",
  "portimao-praia-da-rocha": "/images/portimao-praia-rocha/Apart T1 Praia_Rocha_10.jpeg",
  onegreenway: "/images/onegreenway/hero-1.jpg",
};
// Fallback neutro pra imóvel sem nenhuma foto ainda (rascunho) — nunca outro
// imóvel específico. Mesmo arquivo já usado como fallback de metadata/OG.
const NEUTRAL_COVER_IMAGE = "/images/rui/hero-portrait.jpg";
const COVER_IMAGE_POSITION: Record<string, string> = {
  verdelago: "object-[center_22%]",
};

const AUTOPLAY_PX_PER_SEC = 40;
const AUTOPLAY_TICK_MS = 40;
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
  coverImages,
  onDragClick,
}: {
  property: Property;
  locale: string;
  c: (key: string) => string;
  p: (key: string) => string;
  coverImages: Record<string, string>;
  onDragClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <NextLink
      href={hrefFor(property)}
      onClick={onDragClick}
      draggable={false}
      className="group block overflow-hidden rounded-lg border border-border bg-background-raised shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={COVER_IMAGE_BY_REFERENCE[property.reference] ?? coverImages[property.id] ?? NEUTRAL_COVER_IMAGE}
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
// visual contínuo), anda sozinho devagar (setInterval — ver abaixo), pausa
// só durante um arrasto de verdade, e aceita arrastar (Pointer Events, mesmo
// padrão unificado mouse+toque de PropertyNavArrows/ZoomableImage). Não ativa
// autoplay se o visitante pedir menos movimento.
//
// Achado 28/08: tinha pausa também no hover (mouseenter/mouseleave), mas
// como a faixa ocupa quase a largura inteira da tela, bastava o cursor ficar
// parado sobre a seção (ex. depois de rolar a página com o mouse) pra
// autoplay nunca sair do lugar — foi removida, só o arrasto ativo pausa.
function CarouselCollection({
  properties,
  locale,
  c,
  p,
  coverImages,
}: {
  properties: Property[];
  locale: string;
  c: (key: string) => string;
  p: (key: string) => string;
  coverImages: Record<string, string>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const dragState = useRef<{ startX: number; startScroll: number; moved: boolean } | null>(null);

  useEffect(() => {
    if (paused) return;
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // setInterval em vez de requestAnimationFrame — mais previsível pra um
    // scroll de fundo bem lento como este, e não depende do navegador estar
    // renderizando frames a 60fps (rAF pode ser suspenso/atrasado por throttling
    // de aba, o que fazia o carrossel parecer "parado" mesmo funcionando).
    const stepPx = AUTOPLAY_PX_PER_SEC * (AUTOPLAY_TICK_MS / 1000);
    const id = window.setInterval(() => {
      const setWidth = track.scrollWidth / 2;
      if (setWidth <= 0) return;
      let next = track.scrollLeft + stepPx;
      if (next >= setWidth) next -= setWidth;
      track.scrollLeft = next;
    }, AUTOPLAY_TICK_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  function handlePointerDown(e: React.PointerEvent) {
    const track = trackRef.current;
    if (!track) return;
    // NÃO captura o ponteiro aqui ainda (achado 28/08): capturar no down
    // redireciona o pointerup/click resultante pra própria faixa em vez do
    // card, então um clique normal (sem arrastar) nunca chegava a acionar o
    // link — era por isso que nenhum card da Home abria. Só decide se é
    // arrasto de verdade dentro do pointermove, abaixo.
    dragState.current = { startX: e.clientX, startScroll: track.scrollLeft, moved: false };
    setPaused(true);
  }

  function handlePointerMove(e: React.PointerEvent) {
    const track = trackRef.current;
    const drag = dragState.current;
    if (!track || !drag) return;
    const delta = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(delta) > DRAG_CLICK_SUPPRESS_THRESHOLD) {
      drag.moved = true;
      // só a partir daqui é arrasto de verdade — agora sim captura o
      // ponteiro, pra continuar recebendo o movimento mesmo se o cursor sair
      // por cima de um card ou dos limites da faixa.
      try {
        track.setPointerCapture(e.pointerId);
      } catch {
        // captura indisponível — arrasto ainda funciona enquanto o ponteiro segue sobre a faixa
      }
    }
    if (!drag.moved) return; // ainda dentro da margem de clique — deixa o clique normal acontecer
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
      className="flex gap-6 overflow-x-hidden touch-pan-y cursor-grab active:cursor-grabbing select-none"
    >
      {[...properties, ...properties].map((property, i) => (
        <div key={`${property.id}-${i}`} className="w-[78vw] max-w-[340px] flex-shrink-0 sm:w-[320px]">
          <PropertyCard
            property={property}
            locale={locale}
            c={c}
            p={p}
            coverImages={coverImages}
            onDragClick={handleCardClick}
          />
        </div>
      ))}
    </div>
  );
}

export function CuratedCollection({
  properties,
  coverImages = {},
  viewAllHref,
  hideHeading,
  layout = "grid",
}: {
  properties: Property[];
  coverImages?: Record<string, string>;
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
          <CarouselCollection properties={properties} locale={locale} c={c} p={p} coverImages={coverImages} />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
            {properties.map((property) => (
              <Reveal key={property.id} className="block">
                <PropertyCard property={property} locale={locale} c={c} p={p} coverImages={coverImages} />
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
