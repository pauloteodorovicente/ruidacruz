"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/app/components/Reveal";

type Section = { title: string; body: string };

export function GuiaContent() {
  const g = useTranslations("guiaCompradorEstrangeiro");
  const sections = g.raw("sections") as Section[];

  return (
    <Reveal className="block">
      <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2 text-center">{g("eyebrow")}</p>
      <h1 className="font-display text-3xl md:text-4xl mb-6 text-center">{g("title")}</h1>
      <p className="font-body text-base md:text-lg leading-relaxed text-foreground-muted text-center max-w-2xl mx-auto mb-14">
        {g("intro")}
      </p>

      <div className="flex flex-col gap-10 max-w-2xl mx-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-xl md:text-2xl text-accent mb-3">{section.title}</h2>
            <p className="font-body text-base leading-relaxed text-foreground-muted">{section.body}</p>
          </div>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-foreground-muted/70 max-w-2xl mx-auto mt-14 pt-8 border-t border-border">
        {g("disclaimer")}
      </p>
    </Reveal>
  );
}
