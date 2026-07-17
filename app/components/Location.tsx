"use client";

import { useLanguage } from "@/lib/language-context";
import { Reveal } from "./Reveal";

const MAP_URL = "https://www.google.com/maps/place/Q.ta+do+Chantre,+Le%C3%A7a+do+Balio/@41.2217061,-8.6256119,17z";

export function Location() {
  const { t } = useLanguage();
  const l = t.location;

  return (
    <section className="bg-background-raised px-6 py-14 md:px-12 md:py-20 border-y border-border">
      <Reveal className="mx-auto max-w-3xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{l.eyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-6">{l.title}</h2>
        <p className="font-body text-base md:text-lg text-foreground-muted leading-relaxed mb-6">
          {l.text}
        </p>
        <a
          href={MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm tracking-[0.05em] uppercase text-accent border-b border-accent pb-0.5 hover:text-accent-strong transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
        >
          {l.mapLink} →
        </a>
      </Reveal>
    </section>
  );
}
