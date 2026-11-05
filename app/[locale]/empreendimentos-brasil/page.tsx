import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { localeAlternates, localizedUrl } from "@/lib/locale-alternates";
import { BRASIL_DEVELOPMENTS, BRASIL_UI, formatBrl } from "@/lib/brasil-developments";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";
import { ScheduleCallFloating } from "@/app/components/ScheduleCallFloating";
import { BreadcrumbSchema } from "@/app/components/BreadcrumbSchema";

const PATH = "/empreendimentos-brasil";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ui = BRASIL_UI[locale as AppLocale] ?? BRASIL_UI["pt-PT"];
  return {
    title: ui.metaTitle,
    description: ui.metaDescription,
    alternates: { canonical: localizedUrl(locale, PATH), languages: localeAlternates(PATH) },
    openGraph: {
      title: ui.metaTitle,
      description: ui.metaDescription,
      images: [BRASIL_DEVELOPMENTS[0].hero],
      type: "website",
    },
  };
}

export default async function BrasilDevelopmentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (locale in BRASIL_UI ? locale : "pt-PT") as AppLocale;
  const ui = BRASIL_UI[loc];
  const prefix = locale === "pt-PT" ? "" : `/${locale}`;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", path: prefix || "/" },
          { name: ui.title, path: `${prefix}${PATH}` },
        ]}
      />
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 pt-32 pb-8 md:px-12 md:pt-40">
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-3">{ui.eyebrow}</p>
          <h1 className="font-display text-3xl md:text-4xl mb-3">{ui.title}</h1>
          <p className="max-w-2xl text-sm text-foreground-muted">{ui.subtitle}</p>
        </div>

        <section className="bg-background px-6 pb-20 md:px-12">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
            {BRASIL_DEVELOPMENTS.map((d) => (
              <Link
                key={d.slug}
                href={`${PATH}/${d.slug}`}
                className="group block overflow-hidden rounded-lg border border-border bg-background-raised shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.35)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={d.hero}
                    alt={d.heroAlt}
                    fill
                    sizes="(min-width: 768px) 560px, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs tracking-[0.15em] uppercase text-foreground-muted">
                      {[d.neighborhood, d.city].filter(Boolean).join(" · ")}
                    </p>
                    <span className="shrink-0 text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 border border-accent/40 text-accent">
                      Brasil
                    </span>
                  </div>
                  <p className="font-display text-2xl mt-2">{d.name}</p>
                  {d.tagline && <p className="mt-1 text-sm text-foreground-muted">{d.tagline[loc]}</p>}
                  <p className="mt-3 text-sm text-accent">
                    {d.priceFrom === d.priceTo ? "" : `${ui.from} `}
                    {formatBrl(d.priceFrom, loc)}
                  </p>
                  <p className="mt-1 text-xs text-foreground-muted">
                    {d.typologies[loc]} · {d.area}
                  </p>
                  <p className="mt-4 text-xs tracking-[0.15em] uppercase text-accent border-b border-accent/40 inline-block pb-1">
                    {ui.viewDetails}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-6xl text-xs text-foreground-muted">{ui.noteGlobal}</p>
        </section>
      </main>
      <SiteFooter />
      <SiteWhatsAppFloating />
      <ScheduleCallFloating />
    </>
  );
}
