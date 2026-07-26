"use client";

import { useLanguage } from "@/lib/language-context";
import { Reveal } from "./Reveal";
import type { Property } from "@/lib/properties";

export function PropertyHighlights({ property }: { property: Property }) {
  const { t } = useLanguage();
  const p = t.property;

  if (property.highlights.length === 0) return null;

  return (
    <section className="bg-background-raised px-6 py-14 md:px-12 md:py-20 border-y border-border">
      <Reveal className="mx-auto max-w-4xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-8">{p.details}</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
          {property.highlights.map((item) => (
            <li
              key={item}
              className="font-body text-base text-foreground border-b border-border pb-4 flex items-start gap-3"
            >
              <span className="text-accent mt-1">—</span>
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
