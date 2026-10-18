import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getProperties, getPropertyByReference, getPropertyPhotos, getPropertyFloorplans, getPropertyTranslation } from "@/lib/properties";
import { localizeProperty, propertyPathSegment } from "@/lib/property-types";
import { localeAlternates, localizedUrl } from "@/lib/locale-alternates";
import { resolveCover } from "@/lib/cover";
import { getPropertyByReferenceForAdmin, getPropertyByReferenceWithPreviewToken, getOffMarketTeaser } from "@/lib/admin-properties";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPropertyHero } from "@/lib/property-hero";
import { getTypeColorThemes } from "@/lib/settings";
import { resolveColorThemeSlug } from "@/lib/property-colors";
import { resolveSectionOrder, type SectionId } from "@/lib/section-order";
import { PagePalette } from "@/app/components/site/PagePalette";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { PropertyHero } from "@/app/components/PropertyHero";
import { PropertyDynamicHero } from "@/app/components/site/PropertyDynamicHero";
import { PropertyDetails } from "@/app/components/PropertyDetails";
import { PropertyVirtualTour } from "@/app/components/PropertyVirtualTour";
import { PropertyHighlights } from "@/app/components/PropertyHighlights";
import { PropertyGallery } from "@/app/components/PropertyGallery";
import { PropertyFloorPlan } from "@/app/components/PropertyFloorPlan";
import { PropertyLocation } from "@/app/components/PropertyLocation";
import { ArchitectCredit } from "@/app/components/ArchitectCredit";
import { SiteLeadForm } from "@/app/components/site/SiteLeadForm";
import { PropertyNavArrows } from "@/app/components/PropertyNavArrows";
import { BreadcrumbSchema } from "@/app/components/BreadcrumbSchema";
import { OffMarketTeaser } from "./OffMarketTeaser";
import type { Property, PropertyPhoto, PropertyFloorplan, Locale } from "@/lib/properties";
import type { ReactNode } from "react";

// A ordem das seções vem de lib/section-order.ts: a ordem guardada no admin
// (Layout da página, properties.section_order) ou, sem ela, a do "Modelo da
// Página" — Arquitetura destaca quem assinou o projeto, Paisagem/Terreno e Urbano
// adiantam a Localização. Seção sem conteúdo (ex.: sem visita virtual) não ocupa lugar.
function sectionsForMode(
  property: Property,
  photos: PropertyPhoto[],
  floorplans: PropertyFloorplan[],
  galleryVideo?: { src: string; poster?: string },
): ReactNode[] {
  const sections: Record<SectionId, ReactNode> = {
    details: <PropertyDetails property={property} key="details" />,
    // Visita virtual em destaque (só quando o imóvel tem link).
    tour: property.virtual_tour_url ? (
      <PropertyVirtualTour url={property.virtual_tour_url} title={property.title} key="virtual-tour" />
    ) : null,
    architect: property.layout_mode === "arquitetura" ? <ArchitectCredit property={property} key="architect" /> : null,
    highlights: <PropertyHighlights property={property} key="highlights" />,
    gallery: (
      <PropertyGallery
        photos={photos}
        alt={property.title}
        video={galleryVideo}
        videoInGrid={property.gallery_video_in_grid}
        featured={property.gallery_featured}
        key="gallery"
      />
    ),
    floorplan: <PropertyFloorPlan floorplans={floorplans} propertyReference={property.reference} key="floorplan" />,
    location: <PropertyLocation property={property} key="location" />,
  };
  return resolveSectionOrder(property.layout_mode, property.section_order).map((id) => sections[id]);
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; referencia: string }>;
  searchParams: Promise<{ preview?: string }>;
}): Promise<Metadata> {
  const { locale, referencia } = await params;
  const { preview } = await searchParams;
  // Mesma regra de visibilidade da página em si (admin vê rascunho, link de
  // preview vê o rascunho daquele token, visitante comum só vê publicado) —
  // achado 28/08: antes usava só a busca pública aqui, então um imóvel ainda
  // rascunho perdia título/imagem própria no título da aba e na prévia de
  // link (WhatsApp etc.), caindo no genérico do site inteiro.
  const isAdmin = await isAdminAuthenticated();
  const rawProperty = isAdmin
    ? await getPropertyByReferenceForAdmin(referencia)
    : preview
      ? await getPropertyByReferenceWithPreviewToken(referencia, preview)
      : await getPropertyByReference(referencia);
  if (!rawProperty) return {};

  const translation =
    locale === rawProperty.source_locale ? null : await getPropertyTranslation(rawProperty.id, locale as Locale);
  const property = localizeProperty(rawProperty, translation);
  // Capa definida no admin > primeira foto visível (regra única, lib/cover.ts).
  const coverImage =
    resolveCover(await getPropertyPhotos(property.id), property.cover_photo_id).photo?.storage_path ??
    "/images/rui/hero-portrait.jpg";

  const title = `${property.title} | Rui Da Cruz`;
  const description = property.description ?? undefined;
  return {
    title,
    description,
    alternates: { canonical: localizedUrl(locale, `/imoveis/${propertyPathSegment(property)}`), languages: localeAlternates(`/imoveis/${propertyPathSegment(property)}`) },
    openGraph: {
      title,
      description,
      images: [coverImage],
      type: "website",
    },
  };
}

// RealEstateListing por imóvel (JSON-LD) — mesmo schema da Leça do Balio
// (app/leca-do-balio/page.tsx), mas montado a partir dos dados reais no
// Supabase em vez de fixo, já que agora vale pra qualquer imóvel publicado.
function propertyJsonLd(property: Property, coverImage: string, locale: string) {
  const prefix = locale === "pt-PT" ? "" : `/${locale}`;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description ?? undefined,
    url: `https://ruidacruzconsultor.com${prefix}/imoveis/${propertyPathSegment(property)}`,
    image: coverImage.startsWith("http") ? coverImage : `https://ruidacruzconsultor.com${coverImage}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.municipality ?? property.zone ?? undefined,
      addressCountry: "PT",
    },
    offers: property.price_on_application
      ? undefined
      : { "@type": "Offer", price: property.price ?? undefined, priceCurrency: "EUR" },
    floorSize: property.construction_area_sqm
      ? { "@type": "QuantitativeValue", value: property.construction_area_sqm, unitCode: "MTK" }
      : undefined,
    lotSize: property.land_area_sqm
      ? { "@type": "QuantitativeValue", value: property.land_area_sqm, unitCode: "MTK" }
      : undefined,
    broker: {
      "@type": "RealEstateAgent",
      name: "Rui Da Cruz",
      telephone: "+351939081583",
    },
  };
}

// Landings de campanha também vivem em app/[locale] (idioma na URL), então o
// prefixo vale pra elas e pra ficha genérica — antes a seta anterior/próximo
// levava sempre pro português quando o vizinho era uma landing.
function hrefForProperty(property: Property, locale: string): string {
  const prefix = locale === "pt-PT" ? "" : `/${locale}`;
  if (property.is_campaign_page && property.campaign_path) return `${prefix}${property.campaign_path}`;
  return `${prefix}/imoveis/${propertyPathSegment(property)}`;
}

export default async function ImovelPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; referencia: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { locale, referencia } = await params;
  const { preview } = await searchParams;
  const isAdmin = await isAdminAuthenticated();
  // Admin vê rascunhos (modo de pré-visualização); um link com ?preview=TOKEN
  // válido e ainda não expirado também vê, sem precisar logar; visitante
  // público comum só vê o que passar pela RLS (published = true), que já
  // trata o "não encontrado".
  const rawProperty = isAdmin
    ? await getPropertyByReferenceForAdmin(referencia)
    : preview
      ? await getPropertyByReferenceWithPreviewToken(referencia, preview)
      : await getPropertyByReference(referencia);

  // Sem resultado pelo caminho normal — antes de desistir (404), confere se
  // é um imóvel Fora de Mercado publicado: a RLS já esconde esses da leitura
  // pública de propósito (ver properties_public_read), então cair aqui é
  // esperado pra eles, não um erro. Mostra um teaser + pedido de acesso em
  // vez do 404 seco.
  if (!rawProperty) {
    const teaser = !isAdmin && !preview ? await getOffMarketTeaser(referencia) : null;
    if (teaser) return <OffMarketTeaser teaser={teaser} locale={locale} />;
    notFound();
  }

  // O endereço oficial da ficha é o do slug (quando o imóvel tem um): quem
  // chega pela referência (link antigo, nº REMAX) vai pro amigável, sem quebrar
  // nenhum link já compartilhado. Só pro visitante comum — admin e link de
  // pré-visualização seguem na URL em que entraram (o preview carrega o token
  // na query, que um redirect perderia).
  if (!isAdmin && !preview && rawProperty.slug && referencia !== rawProperty.slug) {
    const localePrefix = locale === "pt-PT" ? "" : `/${locale}`;
    permanentRedirect(`${localePrefix}/imoveis/${rawProperty.slug}`);
  }

  // Título/descrição/destaques no idioma sendo visto — pt-PT (fonte) mostra
  // sempre o original; os outros 6 mostram a tradução se já existir (gerada
  // via DeepL na publicação, ver lib/translate-property.ts), ou o original
  // como fallback enquanto não existir/estiver pendente.
  const translation =
    locale === rawProperty.source_locale ? null : await getPropertyTranslation(rawProperty.id, locale as Locale);
  const property = localizeProperty(rawProperty, translation);

  const [allPhotos, floorplans, propertyHero, allProperties, typeColorThemes] = await Promise.all([
    getPropertyPhotos(property.id),
    getPropertyFloorplans(property.id),
    getPropertyHero(property.id),
    getProperties(),
    getTypeColorThemes(),
  ]);
  // Cor da página inteira: paleta da própria ficha > paleta do tipo > padrão.
  const colorThemeSlug = resolveColorThemeSlug(property.color_theme, property.property_type, typeColorThemes);
  // "Arquivar" foto (pedido do Paulo, 24/08) — some daqui (visitante público,
  // preview e admin veem a mesma ficha), mas continua listada e editável no
  // PhotoManager do admin, que busca a lista própria sem esse filtro.
  const photos = allPhotos.filter((photo) => photo.visible);
  // Fallback neutro pra imóvel sem foto ainda (rascunho) — nunca a foto de
  // outro imóvel. Achado 24/08: um Terreno sem fotos estava herdando a
  // fachada da Leça do Balio na Hero e no JSON-LD por causa desse fallback.
  // null = imóvel sem foto visível: o Hero mostra a assinatura do Rui; prévia de
  // link e JSON-LD (que não podem usar a assinatura) caem na foto neutra do site.
  const coverPhotoPath = resolveCover(allPhotos, property.cover_photo_id).photo?.storage_path ?? null;
  const coverImage = coverPhotoPath ?? "/images/rui/hero-portrait.jpg";
  // O mesmo vídeo do Hero (quando existir) também aparece na galeria, como
  // card próprio antes das fotos (pedido do Paulo, 02/09) — mesma fonte de
  // dado, sem duplicar upload nem campo novo pra isso.
  const heroVideoItem = propertyHero?.media_type === "video" ? propertyHero.items[0] : undefined;
  const galleryVideo = heroVideoItem ? { src: heroVideoItem.src, poster: heroVideoItem.poster } : undefined;
  const p = await getTranslations({ locale, namespace: "property" });

  // Anterior/próximo "infinito" — nunca mostra fim de lista, dá a volta.
  // Usa sempre a lista pública (mesma ordem do /portfolio), mesmo se quem
  // está vendo é o admin ou entrou via link de pré-visualização — a
  // navegação lateral é um recurso pro visitante comum, não uma ferramenta
  // de admin. Some sozinha se o imóvel atual não estiver nessa lista
  // (rascunho sendo pré-visualizado) ou se não houver outro pra navegar.
  const currentIndex = allProperties.findIndex((item) => item.id === property.id);
  const hasNeighbors = currentIndex !== -1 && allProperties.length >= 2;
  const prevProperty = hasNeighbors
    ? allProperties[(currentIndex - 1 + allProperties.length) % allProperties.length]
    : null;
  const nextProperty = hasNeighbors ? allProperties[(currentIndex + 1) % allProperties.length] : null;
  const heroEyebrow = property.zone ?? p(`propertyTypeTags.${property.property_type}`);
  const portfolioLabel = await getTranslations({ locale, namespace: "home.portfolioPage" });
  const prefix = locale === "pt-PT" ? "" : `/${locale}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd(property, coverImage, locale)) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: prefix || "/" },
          { name: portfolioLabel("title"), path: `${prefix}/portfolio` },
          { name: property.title, path: `${prefix}/imoveis/${propertyPathSegment(property)}` },
        ]}
      />
      {(isAdmin || preview) && !property.published && (
        <div className="bg-accent px-6 py-2 text-center text-xs font-body tracking-[0.08em] uppercase text-background">
          Pré-visualização — este imóvel ainda não está publicado
        </div>
      )}
      <PagePalette slug={colorThemeSlug} />
      <SiteHeader />
      <main className="flex-1">
        {prevProperty && nextProperty && (
          <PropertyNavArrows
            prevHref={hrefForProperty(prevProperty, locale)}
            nextHref={hrefForProperty(nextProperty, locale)}
            prevLabel={prevProperty.title}
            nextLabel={nextProperty.title}
          />
        )}
        {propertyHero && propertyHero.items.length > 0 ? (
          <PropertyDynamicHero hero={propertyHero} eyebrow={heroEyebrow} title={property.title} propertyId={property.id} />
        ) : (
          <PropertyHero property={property} coverImage={coverPhotoPath} />
        )}
        {sectionsForMode(property, photos, floorplans, galleryVideo)}
        <SiteLeadForm
          // zone aqui é a "Zona GHL" (dropdown fechado), não a "Zona" de
          // exibição da página — ver migração 0014_ghl_zone.sql.
          property={{ reference: property.reference, title: property.title, zone: property.ghl_zone }}
        />
      </main>
      <SiteFooter />
      <SiteWhatsAppFloating />
      <ScheduleCallFloating />
    </>
  );
}
