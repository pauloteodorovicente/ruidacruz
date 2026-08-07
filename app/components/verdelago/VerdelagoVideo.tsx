"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal } from "../Reveal";

const YOUTUBE_ID = "8VA_Y43QkKI";

// Player clicável em vez de autoplay embutido — evita o chrome da UI do
// YouTube aparecer sem interação do visitante, mantendo a estética quiet
// luxury até o clique.
export function VerdelagoVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-background px-6 py-14 md:px-12 md:py-20">
      <Reveal className="mx-auto max-w-5xl block">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">Vídeo</p>
        <h2 className="font-display text-3xl md:text-4xl mb-10">Conheça o Verdelago em movimento</h2>

        <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-black">
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1`}
              title="Vídeo do Verdelago Resort"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 h-full w-full"
              aria-label="Reproduzir vídeo do Verdelago"
            >
              <Image
                src={`https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
                alt="Vídeo do Verdelago Resort"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform group-hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 translate-x-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
      </Reveal>
    </section>
  );
}
