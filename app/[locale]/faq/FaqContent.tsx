"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/app/components/Reveal";

type Item = { question: string; answer: string };

// Acordeão simples — uma pergunta aberta por vez, sem biblioteca nova.
export function FaqContent() {
  const f = useTranslations("faq");
  const items = f.raw("items") as Item[];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Reveal className="block">
      <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2 text-center">{f("eyebrow")}</p>
      <h1 className="font-display text-3xl md:text-4xl mb-6 text-center">{f("title")}</h1>
      <p className="font-body text-base md:text-lg leading-relaxed text-foreground-muted text-center max-w-2xl mx-auto mb-14">
        {f("intro")}
      </p>

      <div className="flex flex-col max-w-2xl mx-auto border-t border-border">
        {items.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.question} className="border-b border-border">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-lg text-foreground hover:text-accent transition-colors"
              >
                {item.question}
                <span className={`shrink-0 text-accent transition-transform ${open ? "rotate-45" : ""}`}>+</span>
              </button>
              {open && (
                <p className="font-body text-sm leading-relaxed text-foreground-muted pb-5">{item.answer}</p>
              )}
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
