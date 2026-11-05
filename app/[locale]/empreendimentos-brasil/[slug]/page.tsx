import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { localeAlternates, localizedUrl } from "@/lib/locale-alternates";
import {
  BRASIL_DEVELOPMENTS,
  BRASIL_UI,
  describeDevelopment,
  formatBrl,
  getBrasilDevelopment,
} from "@/lib/brasil-developments";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteLeadForm } from "@/app/components/site/SiteLeadForm";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { BreadcrumbSchema } from "@/app/components/BreadcrumbSchema";

const LIST_PATH = "/empreendimentos-brasil";

export function generateStaticParams() {
  return BRASIL_DEVELOPMENTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const d = getBrasilDevelopment(slug);
  if (!d) return {};
  const loc = (locale in BRASIL_UI ? locale : "pt-PT") as AppLocale;
  const ui = BRASIL_UI[loc];
  const place = [d.neighborhood, d.city].filter(Boolean).join(", ");
  const title = `${d.name} · ${place} | Rui da Cruz`;
  const description = `${d.typologies[loc]}, ${d.area}. ${d.priceFrom === d.priceTo ? ui.priceFixed : ui.from} ${formatBrl(d.priceFrom, loc)}.`;
  const path = `${LIST_PATH}/${d.slug}`;
  return {
    title,
    description,
    alternates: { canonical: localizedUrl(locale, path), languages: localeAlternates(path) },
    openGraph: { title, description, images: [d.hero], type: "website" },
  };
}

export default async function BrasilDevelopmentPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const d = getBrasilDevelopment(slug);
  if (!d) notFound();
  const loc = (locale in BRASIL_UI ? locale : "pt-PT") as AppLocale;
  const ui = BRASIL_UI[loc];
  const prefix = locale === "pt-PT" ? "" : `/${locale}`;
  const place = [d.neighborhood, d.city].filter(Boolean).join(", ");
  const fixedPrice = d.priceFrom === d.priceTo;
  const kindLabels: Record<string, string> = {
    down: ui.kDown,
    monthly: ui.kMonthly,
    semi: ui.kSemi,
    inter: ui.kInter,
    final: ui.final,
  };

  const facts: [string, string][] = [
    [ui.location, place],
    ...(d.address ? ([[ui.address, d.address]] as [string, string][]) : []),
    ...(d.delivery ? ([[ui.delivery, d.delivery[loc]]] as [string, string][]) : []),
    [ui.typologies, d.typologies[loc]],
    [ui.area, d.area],
    ...(d.parking ? ([[ui.parking, d.parking]] as [string, string][]) : []),
    [ui.developer, d.developer],
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", path: prefix || "/" },
          { name: ui.title, path: `${prefix}${LIST_PATH}` },
          { name: d.name, path: `${prefix}${LIST_PATH}/${d.slug}` },
        ]}
      />
      <SiteHeader />
      <main className="flex-1">
        <section className="relative h-[68vh] min-h-[420px] w-full overflow-hidden bg-black">
          <Image src={d.hero} alt={d.heroAlt} fill priority sizes="100vw" className="object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-10 text-white md:px-12 md:pb-14">
            <p className="text-xs tracking-[0.25em] uppercase text-white/80 mb-2">{place}</p>
            <h1 className="font-display text-4xl md:text-6xl">{d.name}</h1>
            {d.tagline && <p className="mt-2 text-base md:text-lg text-white/85">{d.tagline[loc]}</p>}
            <p className="mt-4 font-display text-xl md:text-2xl">
              {fixedPrice ? "" : `${ui.from} `}
              {formatBrl(d.priceFrom, loc)}
            </p>
            <a
              href="#contacto"
              className="mt-5 inline-block bg-accent px-7 py-3 text-xs tracking-[0.15em] uppercase text-black transition-colors hover:bg-accent-strong"
            >
              {ui.consult}
            </a>
          </div>
        </section>

        <section className="bg-background px-6 py-14 md:px-12 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr]">
            <div>
              <Link
                href={LIST_PATH}
                className="text-xs tracking-[0.15em] uppercase text-accent border-b border-accent/40 pb-1 hover:text-accent-strong"
              >
                ← {ui.back}
              </Link>
              <h2 className="font-display text-2xl md:text-3xl mt-8 mb-4">{ui.about}</h2>
              <p className="text-base leading-relaxed text-foreground/80">{describeDevelopment(d, loc)}</p>
              {d.highlights && (
                <ul className="mt-6 space-y-2 text-sm text-foreground/80">
                  {d.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {h[loc]}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <dl className="rounded-lg border border-border bg-background-raised p-6 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-border/60 py-2.5 last:border-b-0">
                  <dt className="text-foreground-muted">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 pt-2.5">
                <dt className="text-foreground-muted">{fixedPrice ? ui.priceFixed : ui.priceRange}</dt>
                <dd className="text-right text-accent">
                  {fixedPrice
                    ? formatBrl(d.priceFrom, loc)
                    : `${formatBrl(d.priceFrom, loc)} – ${formatBrl(d.priceTo, loc)}`}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {d.videos && d.videos.length > 0 && (
          <section className="bg-background px-6 pb-14 md:px-12 md:pb-20">
            <div className="mx-auto max-w-6xl">
              <h2 className="font-display text-2xl md:text-3xl mb-6">{ui.videos}</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {d.videos.map((v) => (
                  <figure key={v.id} className="overflow-hidden rounded-lg border border-border bg-black">
                    <div className="relative aspect-video">
                      <iframe
                        src={`https://drive.google.com/file/d/${v.id}/preview`}
                        title={`${d.name}, ${v.title[loc]}`}
                        loading="lazy"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full border-0"
                      />
                    </div>
                    <figcaption className="bg-background-raised px-3 py-2 text-xs text-foreground-muted">
                      {v.title[loc]}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-background px-6 pb-14 md:px-12 md:pb-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-2xl md:text-3xl mb-6">{ui.gallery}</h2>
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>figure]:mb-4">
              {d.photos.map((p) => (
                <figure key={p.src} className="break-inside-avoid overflow-hidden rounded-lg border border-border">
                  <Image
                    src={p.src}
                    alt={`${d.name}, ${p.caption[loc]}`}
                    width={p.w}
                    height={p.h}
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full"
                  />
                  <figcaption className="px-3 py-2 text-xs text-foreground-muted">{p.caption[loc]}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {d.conditions && (
          <section className="bg-background-raised px-6 py-14 md:px-12 md:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-2xl md:text-3xl mb-2">{ui.conditions}</h2>
              <p className="text-sm text-foreground-muted mb-6">
                {ui.conditionsFor}: {d.conditions.unit}
              </p>
              <dl className="rounded-lg border border-border bg-background p-6 text-sm">
                <div className="flex justify-between gap-4 border-b border-border/60 py-2.5">
                  <dt className="text-foreground-muted">{ui.total}</dt>
                  <dd className="text-right">{formatBrl(d.conditions.total, loc)}</dd>
                </div>
                {d.conditions.rows.map((r, i) => (
                  <div key={i} className="flex justify-between gap-4 border-b border-border/60 py-2.5 last:border-b-0">
                    <dt className="text-foreground-muted">
                      {r.n > 1 ? `${r.n} × ` : ""}
                      {kindLabels[r.kind]}
                    </dt>
                    <dd className="text-right">{formatBrl(r.value, loc)}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-foreground-muted">{ui.note}</p>
            </div>
          </section>
        )}

        <SiteLeadForm
          property={{ reference: `brasil-${d.slug}`, title: `${d.name} | ${d.city}` }}
          heading={{ eyebrow: ui.leadEyebrow, title: ui.leadTitle, subtitle: ui.leadSubtitle, submitLabel: ui.leadSubmit }}
        />
      </main>
      <SiteFooter />
      <SiteWhatsAppFloating />
      <ScheduleCallFloating />
    </>
  );
}
