"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/app/components/Reveal";
import type { Testimonial } from "@/lib/testimonials";

// Equivalente ao Testimonials.tsx original — a Home institucional sempre
// recebe os depoimentos reais do Supabase, então (diferente do original) não
// precisa do fallback estático da Leça do Balio.
export function SiteTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const s = useTranslations("testimonials");
  const items = testimonials.map((item) => ({ quote: item.quote, author: item.author_name }));

  if (items.length === 0) return null;

  return (
    <section className="bg-background px-6 py-14 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-5xl block">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-12">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{s("eyebrow")}</p>
            <h2 className="font-display text-3xl md:text-4xl">{s("title")}</h2>
          </div>
          <p className="text-sm text-foreground-muted tracking-wide">★ {s("rating")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          {items.map((item) => (
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
