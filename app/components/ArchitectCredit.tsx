"use client";

import { useLanguage } from "@/lib/language-context";
import { Reveal } from "./Reveal";
import type { Property } from "@/lib/properties";

// Só aparece no Modo Arquitetura — o diferencial desse modo é dar destaque
// a quem assinou o projeto, do jeito que a Leça do Balio já fazia no texto
// corrido (agora como um bloco próprio, reutilizável por qualquer imóvel).
export function ArchitectCredit({ property }: { property: Property }) {
  const { locale } = useLanguage();
  if (!property.architect && !property.landscaper) return null;

  const label = locale === "pt" ? "Arquitetura" : "Architecture";
  const landscapeLabel = locale === "pt" ? "Paisagismo" : "Landscape";

  return (
    <section className="bg-background px-6 py-10 md:px-12 border-b border-border">
      <Reveal className="mx-auto max-w-3xl flex flex-wrap gap-x-12 gap-y-3 block">
        {property.architect && (
          <div>
            <p className="text-[11px] tracking-[0.15em] uppercase text-accent mb-1">{label}</p>
            <p className="font-display text-lg">{property.architect}</p>
          </div>
        )}
        {property.landscaper && (
          <div>
            <p className="text-[11px] tracking-[0.15em] uppercase text-accent mb-1">{landscapeLabel}</p>
            <p className="font-display text-lg">{property.landscaper}</p>
          </div>
        )}
      </Reveal>
    </section>
  );
}
