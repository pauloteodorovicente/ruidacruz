"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";
import { trackEvent } from "@/lib/track-event";
import type { Property } from "@/lib/properties";

export function PropertyLocation({ property }: { property: Property }) {
  const p = useTranslations("property");

  if (!property.map_url) return null;

  return (
    <section className="bg-background-raised px-6 py-14 md:px-12 md:py-20 border-y border-border">
      <Reveal className="mx-auto max-w-3xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{p("location")}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-6">
          {property.zone ?? property.municipality}
        </h2>
        <a
          href={property.map_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("map_view", property.reference)}
          className="inline-block text-sm tracking-[0.05em] uppercase text-accent border-b border-accent pb-0.5 hover:text-accent-strong transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
        >
          {p("mapLink")} →
        </a>
      </Reveal>
    </section>
  );
}
