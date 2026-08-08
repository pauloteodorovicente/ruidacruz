"use client";

import { usePortimaoLanguage } from "@/lib/portimao-language-context";
import { Reveal } from "../Reveal";

export function PortimaoIdentification() {
  const { t } = usePortimaoLanguage();
  const i = t.identification;

  return (
    <section className="px-6 py-14 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-4xl block">
        <div className="flex flex-wrap gap-3 mb-6">
          {i.tags.map((tag) => (
            <span key={tag} className="text-[11px] tracking-[0.12em] uppercase px-3 py-1 border border-border text-foreground-muted">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-foreground-muted mb-8">{i.address}</p>
        <dl className="grid grid-cols-3 gap-6 max-w-md">
          {i.specs.map((spec) => (
            <div key={spec.label}>
              <dt className="text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1">{spec.label}</dt>
              <dd className="font-display text-lg">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
