"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";

// Visita virtual 360° incorporada na ficha do imóvel (pedido do Rui, 07/10, pro
// T2 da Morais Soares). O link vem do admin (campo "Visita virtual") e só
// chega aqui se for https://. O botão abre a visita em ecrã inteiro — também é a
// saída caso o serviço de visitas não aceite ser incorporado.
export function PropertyVirtualTour({ url, title }: { url: string; title: string }) {
  const p = useTranslations("property.virtualTour");

  return (
    <section className="bg-background px-6 py-14 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-6xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{p("eyebrow")}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-3">{p("title")}</h2>
        <p className="text-sm text-foreground-muted mb-8 max-w-xl">{p("description")}</p>
        <div className="relative aspect-video w-full overflow-hidden border border-border bg-background-raised">
          <iframe
            src={url}
            title={`${p("iframeTitle")} — ${title}`}
            loading="lazy"
            allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking; autoplay"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-[11px] tracking-[0.1em] uppercase border border-accent text-accent px-5 py-3 transition-colors hover:bg-accent hover:text-background"
        >
          {p("open")}
        </a>
      </Reveal>
    </section>
  );
}
