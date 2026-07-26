"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import type { Property } from "@/lib/properties";

// Hero simples do template genérico — sem o vídeo/parallax do Hero.tsx
// original (isso é específico da Leça do Balio); essa versão só precisa da
// primeira foto do imóvel. Mantém data-hero-wrapper pro Header adaptativo.
export function PropertyHero({ property, coverImage }: { property: Property; coverImage: string }) {
  const { t } = useLanguage();
  const p = t.property;

  return (
    <div data-hero-wrapper className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-black">
      <Image
        src={coverImage}
        alt={property.title}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 text-white z-10">
        <p className="font-body text-xs tracking-[0.25em] uppercase opacity-80 mb-2">
          {property.zone ?? p.propertyTypeTags[property.property_type]}
        </p>
        <p className="font-display text-2xl md:text-3xl">{property.title}</p>
      </div>
    </div>
  );
}
