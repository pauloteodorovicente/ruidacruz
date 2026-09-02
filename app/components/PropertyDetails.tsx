"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "./Reveal";
import { RevealText } from "./RevealText";
import type { Property } from "@/lib/properties";

export function PropertyDetails({ property }: { property: Property }) {
  const locale = useLocale();
  const p = useTranslations("property");

  const tags = [p(`propertyTypeTags.${property.property_type}`), "RE/MAX Collection"];
  if (property.typology) tags.unshift(property.typology);

  const numberFormat = new Intl.NumberFormat(locale);
  const specs: Array<{ label: string; value: string }> = [
    property.typology ? { label: p("specs.typology"), value: property.typology } : null,
    property.land_area_sqm
      ? { label: p("specs.land"), value: `${numberFormat.format(property.land_area_sqm)} m²` }
      : null,
    property.construction_area_sqm
      ? { label: p("specs.construction"), value: `${numberFormat.format(property.construction_area_sqm)} m²` }
      : null,
    property.parking ? { label: p("specs.parking"), value: property.parking } : null,
  ].filter((s): s is { label: string; value: string } => s !== null);

  function scrollToForm() {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  }

  const whatsappMessage = p("whatsappMessage", { title: property.title, reference: property.reference });

  return (
    <section className="relative bg-background px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
        <Reveal className="md:col-span-3 block">
          <div className="flex flex-wrap gap-3 mb-6">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] tracking-[0.12em] uppercase px-3 py-1 border border-border text-foreground-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <RevealText text={property.title} className="font-display text-4xl md:text-5xl leading-tight mb-6" />
          {property.description && (
            // whitespace-pre-line: respeita as quebras de linha/parágrafo que já
            // vêm no texto (achado 02/09 — sem isso o HTML colapsa tudo numa
            // linha só corrida, mesmo com \n\n salvos no banco).
            <p className="font-body text-lg text-foreground-muted leading-relaxed max-w-xl whitespace-pre-line">
              {property.description}
            </p>
          )}
        </Reveal>

        <Reveal className="md:col-span-2 block">
          <div className="md:sticky md:top-8 bg-background-raised border border-border border-t-2 border-t-accent p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
            <span className="inline-block text-[11px] tracking-[0.12em] uppercase px-3 py-1 mb-4 border border-accent/40 text-accent">
              {p(`businessTypeTags.${property.business_type}`)}
            </span>
            <p className="font-display text-3xl mb-6">
              {property.price_on_application
                ? p("priceOnApplication")
                : property.price?.toLocaleString(locale, {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  })}
              {!property.price_on_application && property.business_type === "arrendamento" && (
                <span className="text-base text-foreground-muted">{p("perMonth")}</span>
              )}
            </p>
            {specs.length > 0 && (
              <dl className="grid grid-cols-2 gap-y-4 mb-4">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1">{spec.label}</dt>
                    <dd className="font-display text-lg">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {property.energy_certificate && (
              <p className="text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-4">
                {p("energyCertificate")}: <span className="font-display text-foreground">{property.energy_certificate}</span>
              </p>
            )}
            <p className="text-[10px] tracking-[0.06em] text-foreground-muted/60 mb-8">
              {p("reference")} {property.reference}
            </p>

            <div className="flex items-center gap-3 mb-6 pb-6 border-t border-border pt-6">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                <Image src="/images/rui/rui-cruz.jpg" alt={p("agentName")} fill sizes="44px" className="object-cover" />
              </div>
              <div>
                <p className="font-display text-sm leading-tight">{p("agentName")}</p>
                <p className="text-[11px] text-foreground-muted leading-tight">{p("agentTitle")}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={scrollToForm}
                className="w-full py-3.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                {p("ctaPrimary")}
              </button>
              <a
                href={`https://wa.me/351939081583?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 border border-border text-center font-body text-sm tracking-[0.05em] uppercase transition-all hover:border-accent hover:text-accent hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                {p("ctaWhatsapp")}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
