"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link as LocalizedLink } from "@/i18n/navigation";
import { Reveal } from "./Reveal";
import { FavoriteButton } from "./FavoriteButton";
import { SignatureCover } from "./SignatureCover";
import { CardCoverImages } from "./CardCoverImages";
import type { Property, CardCover } from "@/lib/properties";
import { propertyPathSegment } from "@/lib/property-types";
import { cardPaletteCss, findColorTheme } from "@/lib/property-colors";
import { resolveCardHighlightOptions } from "@/lib/card-highlight";

// Recebe as propriedades já buscadas no Supabase por um Server Component pai
// (app/page.tsx) — mantém o padrão do site de conteúdo traduzido em Client
// Component, sem duplicar a busca de dados aqui.
//
// A capa de cada card (e as demais fotos, se o carrossel estiver ligado) vem
// pronta do servidor em `covers`, já com a regra única de lib/cover.ts: capa
// definida no admin > capa que a landing de campanha já tinha no código >
// primeira foto visível > nenhuma. Antes era um mapeamento fixo aqui, com
// fallback pra uma foto da Leça do Balio — qualquer imóvel novo sem foto
// mostrava a fachada dela por engano (achado 24/08).
// Sem foto nenhuma visível (nem capa definida): o card mostra a assinatura do
// Rui (SignatureCover), na cor de destaque do site — vale pra qualquer imóvel,
// inclusive os já publicados (pedido do Paulo, 09/10/2026).
const COVER_IMAGE_POSITION: Record<string, string> = {
  verdelago: "object-[center_22%]",
};

const AUTOPLAY_PX_PER_SEC = 40;
const AUTOPLAY_TICK_MS = 40;
const DRAG_CLICK_SUPPRESS_THRESHOLD = 6;

// Landings de campanha (Leça, Verdelago...) têm rota própria fora do template
// genérico de imóvel; o resto usa a ficha /imoveis/[slug ou ref]. Todas as
// páginas vivem em app/[locale], então o Link do next-intl (abaixo) põe o
// prefixo do idioma (/en, /es...) sozinho — com o next/link cru, quem estava
// em /en caía na versão em português (achado 08/10).
function hrefFor(property: Property) {
  return property.is_campaign_page && property.campaign_path
    ? property.campaign_path
    : `/imoveis/${propertyPathSegment(property)}`;
}

function PropertyCard({
  property,
  locale,
  c,
  p,
  covers,
  coverIntervalMs,
  fromPrices,
  onDragClick,
}: {
  property: Property;
  locale: string;
  c: (key: string) => string;
  p: (key: string) => string;
  covers: Record<string, CardCover>;
  coverIntervalMs: number;
  fromPrices: Record<string, number>;
  onDragClick?: (e: React.MouseEvent) => void;
}) {
  // "A partir de": menor valor ainda disponível (frações do Verdelago, calculado no
  // servidor — lib/property-typologies.ts). Sem valor calculado, vale o preço do imóvel.
  const fromPrice = fromPrices[property.id];
  // Super-Destaque: cada extra (selo, mais alto, borda, pulsar) liga e desliga no admin.
  const hl = property.card_highlight ? resolveCardHighlightOptions(property.card_highlight_options) : null;
  const shownPrice = fromPrice ?? property.price;
  return (
    <LocalizedLink
      href={hrefFor(property)}
      onClick={onDragClick}
      draggable={false}
      data-card-palette={property.card_highlight ? (findColorTheme(property.card_highlight_color)?.slug ?? undefined) : undefined}
      data-super={property.card_highlight ? "true" : undefined}
      className={`group block overflow-hidden rounded-lg border ${hl?.border ? "border-accent" : "border-border"} ${hl?.pulse ? "card-pulse" : ""} bg-background-raised shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.35)]`}
    >
      <div className={`relative overflow-hidden ${hl?.taller ? "aspect-[5/4]" : "aspect-[4/3]"}`}>
        {covers[property.id]?.photos[0] ? (
          <CardCoverImages
            photos={covers[property.id].photos}
            rotate={covers[property.id].rotate}
            intervalMs={coverIntervalMs}
            seed={property.id}
            alt={property.title}
            imageClassName={`object-cover group-hover:scale-[1.05] ${COVER_IMAGE_POSITION[property.reference] ?? ""}`}
          />
        ) : (
          <SignatureCover />
        )}
        {hl?.badge && (
          <span className="absolute top-3 left-3 z-10 bg-accent px-2.5 py-1 text-[10px] font-medium tracking-[0.14em] uppercase text-background">
            {c("featuredBadge")}
          </span>
        )}
        <FavoriteButton propertyId={property.id} className="absolute top-3 right-3 z-10" />
      </div>
      <div className={hl?.taller ? "p-7" : "p-5"}>
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
            : shownPrice != null
              ? `${fromPrice != null ? `${c("priceFrom")} ` : ""}${shownPrice.toLocaleString(locale, {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                })}`
              : null}
          {!property.price_on_application &&
            property.business_type === "arrendamento" &&
            !property.is_campaign_page && <span className="text-foreground-muted">{p("perMonth")}</span>}
        </p>
      </div>
    </LocalizedLink>
  );
}

// Carrossel infinito — pedido do Paulo (10/08): a grade fixa não escala bem
// além de uns poucos imóveis em destaque. Duplica a lista uma vez (loop
// visual contínuo), anda sozinho devagar (setInterval — ver abaixo), pausa
// no hover/drag, e aceita arrastar (Pointer Events, mesmo padrão unificado
// mouse+toque de PropertyNavArrows/ZoomableImage). Não ativa autoplay se o
// visitante pedir menos movimento.
//
// Achado 28/08: a pausa por hover usava onMouseEnter, mas como a faixa ocupa
// quase a largura inteira da tela, bastava o cursor ficar parado sobre a
// seção (ex. depois de rolar a página com o mouse) pra travar o autoplay —
// rolar a página move o conteúdo por baixo do cursor parado, e isso já basta
// pro navegador disparar mouseenter, mesmo sem o visitante mexer o mouse de
// verdade. Corrigido usando onMouseMove em vez de onMouseEnter: só pausa
// quando o cursor realmente se move em cima da faixa (hover intencional),
// não quando ela só "passa por baixo" dele durante o scroll.
function CarouselCollection({
  properties,
  locale,
  c,
  p,
  covers,
  coverIntervalMs,
  fromPrices,
}: {
  properties: Property[];
  locale: string;
  c: (key: string) => string;
  p: (key: string) => string;
  covers: Record<string, CardCover>;
  coverIntervalMs: number;
  fromPrices: Record<string, number>;
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
      onMouseMove={() => setPaused(true)}
      onMouseLeave={() => !dragState.current && setPaused(false)}
      className="flex items-center gap-6 overflow-x-hidden py-4 touch-pan-y cursor-grab active:cursor-grabbing select-none"
    >
      {[...properties, ...properties].map((property, i) => (
        <div key={`${property.id}-${i}`} className="w-[78vw] max-w-[340px] flex-shrink-0 sm:w-[320px]">
          <PropertyCard
            property={property}
            locale={locale}
            c={c}
            p={p}
            covers={covers}
            coverIntervalMs={coverIntervalMs}
            fromPrices={fromPrices}
            onDragClick={handleCardClick}
          />
        </div>
      ))}
    </div>
  );
}

export function CuratedCollection({
  properties,
  covers = {},
  coverIntervalMs = 5000,
  fromPrices = {},
  viewAllHref,
  hideHeading,
  layout = "grid",
}: {
  properties: Property[];
  covers?: Record<string, CardCover>;
  // Tempo de cada foto quando a capa gira (padrão em Integrações → Capas dos cards).
  coverIntervalMs?: number;
  // Menor valor disponível por imóvel ("A partir de"), calculado no servidor.
  fromPrices?: Record<string, number>;
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
  // Só emite o CSS das paletas dos cards se algum card em Super-Destaque usa uma.
  const needsCardPalettes = properties.some(
    (property) => property.card_highlight && findColorTheme(property.card_highlight_color)?.slug !== undefined,
  );

  return (
    <section id="colecao" className="bg-background px-6 py-14 md:px-12 md:py-20">
      {needsCardPalettes && <style dangerouslySetInnerHTML={{ __html: cardPaletteCss() }} />}
      <div className={useCarousel ? "" : "mx-auto max-w-6xl"}>
        {!hideHeading && (
          <Reveal className={`block ${useCarousel ? "mx-auto max-w-6xl px-6 md:px-12" : ""}`}>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{c("eyebrow")}</p>
            <h2 className="font-display text-3xl md:text-4xl mb-10">{c("title")}</h2>
          </Reveal>
        )}

        {useCarousel ? (
          <CarouselCollection
            properties={properties}
            locale={locale}
            c={c}
            p={p}
            covers={covers}
            coverIntervalMs={coverIntervalMs}
            fromPrices={fromPrices}
          />
        ) : (
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3 md:gap-6">
            {properties.map((property) => (
              <Reveal key={property.id} className="block">
                <PropertyCard
                  property={property}
                  locale={locale}
                  c={c}
                  p={p}
                  covers={covers}
                  coverIntervalMs={coverIntervalMs}
                  fromPrices={fromPrices}
                />
              </Reveal>
            ))}
          </div>
        )}

        {viewAllHref && (
          <Reveal className={`block mt-12 text-center ${useCarousel ? "mx-auto max-w-6xl px-6 md:px-12" : ""}`}>
            <LocalizedLink
              href={viewAllHref}
              className="inline-block text-xs tracking-[0.15em] uppercase text-accent border-b border-accent/40 pb-1 transition-colors hover:text-accent-strong hover:border-accent-strong"
            >
              {c("viewAll")}
            </LocalizedLink>
          </Reveal>
        )}
      </div>
    </section>
  );
}
