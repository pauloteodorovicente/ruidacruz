"use client";

import { useLanguage } from "@/lib/language-context";
import { Reveal } from "./Reveal";

export function Testimonials() {
  const { t } = useLanguage();
  const s = t.testimonials;

  return (
    <section className="bg-background px-6 py-14 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-5xl block">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-12">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{s.eyebrow}</p>
            <h2 className="font-display text-3xl md:text-4xl">{s.title}</h2>
          </div>
          <p className="text-sm text-foreground-muted tracking-wide">★ {s.rating}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          {s.items.map((item) => (
            <figure key={item.author} className="border-t border-border pt-6">
              <blockquote className="font-body text-base leading-relaxed text-foreground-muted">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-4 font-display text-sm text-foreground">
                {item.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
