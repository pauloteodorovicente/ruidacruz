"use client";

import { useOneGreenwayLanguage } from "@/lib/onegreenway-language-context";
import { Reveal } from "../Reveal";

export type OneGreenwayTypologyGroup = {
  id: string;
  priceFrom: number | null;
  byLocale: Record<string, { name: string; description: string }>;
};

// Recebe os grupos já com a tradução das 7 línguas embutida por prop (vem do
// banco — property_typologies + property_typology_translations, ver
// app/onegreenway/page.tsx) em vez do array "typologies.groups" fixo de
// lib/onegreenway-content.ts. A escolha de qual idioma mostrar continua
// client-side (useOneGreenwayLanguage), igual o resto da página — essa
// rota fica fora da árvore [locale], não tem locale na URL.
export function OneGreenwayTypologies({ groups }: { groups: OneGreenwayTypologyGroup[] }) {
  const { t, locale } = useOneGreenwayLanguage();
  const ty = t.typologies;

  if (groups.length === 0) return null;

  return (
    <section className="px-6 py-14 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-3xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{ty.eyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-4">{ty.title}</h2>
        <p className="text-sm text-foreground-muted mb-8">{ty.intro}</p>

        <div className="flex flex-col gap-4">
          {groups.map((group) => {
            const localized = group.byLocale[locale] ?? group.byLocale["pt-PT"];
            return (
              <div key={group.id} className="border border-border p-6">
                <p className="font-display text-lg mb-2">{localized.name}</p>
                <p className="text-sm text-foreground-muted leading-relaxed mb-4">{localized.description}</p>
                {group.priceFrom !== null && (
                  <p className="text-xs tracking-[0.1em] uppercase text-foreground-muted">
                    {ty.fromLabel}{" "}
                    <span className="font-display text-accent normal-case tracking-normal text-base">
                      {group.priceFrom.toLocaleString(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}
                    </span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-foreground-muted/70 mt-4">{ty.note}</p>
      </Reveal>
    </section>
  );
}
