"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";

export function Hero() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <div className="relative h-[160vh]">
      <section className="sticky top-0 h-[75vh] min-h-[520px] w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoEnded ? "opacity-0" : "opacity-100"}`}
          src="/videos/hero.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => setVideoEnded(true)}
        />

        <Image
          src="/images/leca-do-balio/01-hero-fachada.jpg"
          alt={t.hero.location}
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${videoEnded ? "opacity-100" : "opacity-0"}`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

        {!videoEnded && (
          <button
            onClick={toggleSound}
            aria-label={muted ? "Ativar som" : "Silenciar"}
            className="absolute bottom-8 right-6 md:bottom-12 md:right-12 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white hover:border-white transition-colors"
          >
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 9v6h4l5 5V4L8 9H4Z" strokeLinejoin="round" />
                <path d="M17 8.5a5 5 0 0 1 0 7" strokeLinecap="round" />
                <path d="M20 6a9 9 0 0 1 0 12" strokeLinecap="round" opacity="0.5" />
                <path d="M2 2l20 20" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 9v6h4l5 5V4L8 9H4Z" strokeLinejoin="round" />
                <path d="M17 8.5a5 5 0 0 1 0 7" strokeLinecap="round" />
                <path d="M20 6a9 9 0 0 1 0 12" strokeLinecap="round" />
              </svg>
            )}
          </button>
        )}

        <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 text-white z-10">
          <p className="font-body text-xs tracking-[0.25em] uppercase opacity-80 mb-2">
            {t.hero.eyebrow}
          </p>
          <p className="font-display text-2xl md:text-3xl">{t.hero.location}</p>
        </div>
      </section>
    </div>
  );
}
