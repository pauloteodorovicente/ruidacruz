"use client";

import { Reveal } from "../Reveal";

// Texto só em PT-PT por ora.
export function VerdelagoCertification() {
  return (
    <section className="bg-background px-6 py-10 md:px-12 md:py-14">
      <Reveal className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center gap-6 border border-border px-8 py-8 text-center sm:text-left">
        <div className="flex gap-4 shrink-0">
          <span className="text-[11px] tracking-[0.1em] uppercase border border-accent text-accent px-3 py-1.5">
            Green Globe
          </span>
          <span className="text-[11px] tracking-[0.1em] uppercase border border-accent text-accent px-3 py-1.5">
            Green Key
          </span>
        </div>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Um compromisso genuíno com a sustentabilidade, reconhecido internacionalmente — baixa densidade
          construtiva, gestão consciente da água e da energia, e respeito pela paisagem natural do Algarve.
        </p>
      </Reveal>
    </section>
  );
}
