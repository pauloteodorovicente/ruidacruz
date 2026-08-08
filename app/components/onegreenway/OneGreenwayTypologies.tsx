"use client";

import { useOneGreenwayLanguage } from "@/lib/onegreenway-language-context";
import { Reveal } from "../Reveal";

export function OneGreenwayTypologies() {
  const { t } = useOneGreenwayLanguage();
  const ty = t.typologies;

  return (
    <section className="px-6 py-14 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-3xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{ty.eyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-4">{ty.title}</h2>
        <p className="text-sm text-foreground-muted mb-8">{ty.intro}</p>

        <div className="flex flex-col gap-4">
          {ty.groups.map((group) => (
            <div key={group.name} className="border border-border p-6">
              <p className="font-display text-lg mb-2">{group.name}</p>
              <p className="text-sm text-foreground-muted leading-relaxed mb-4">{group.description}</p>
              <p className="text-xs tracking-[0.1em] uppercase text-foreground-muted">
                {ty.fromLabel}{" "}
                <span className="font-display text-accent normal-case tracking-normal text-base">{group.from}</span>
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground-muted/70 mt-4">{ty.note}</p>
      </Reveal>
    </section>
  );
}
