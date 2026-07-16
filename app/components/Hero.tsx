"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";

export function Hero() {
  const { t } = useLanguage();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [autoplayVideo, setAutoplayVideo] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAutoplayVideo(false);
    }
  }, []);

  // Parallax: enquanto a secção fica presa no topo (scroll dentro do wrapper
  // mais alto), o texto sobe por conta própria — sinaliza que é intencional,
  // não a página travada. Respeita prefers-reduced-motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;

    function update() {
      ticking = false;
      const wrapper = wrapperRef.current;
      const text = textRef.current;
      if (!wrapper || !text) return;

      const rect = wrapper.getBoundingClientRect();
      const pinRange = wrapper.offsetHeight - window.innerHeight;
      const progress = pinRange > 0 ? Math.min(1, Math.max(0, -rect.top / pinRange)) : 0;

      text.style.transform = `translateY(${progress * -120}px)`;
      text.style.opacity = `${1 - progress * 0.8}`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <div ref={wrapperRef} data-hero-wrapper className="relative h-[160vh]">
      <section className="sticky top-0 h-[75vh] min-h-[520px] w-full overflow-hidden bg-black">
        {autoplayVideo && (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoEnded ? "opacity-0" : "opacity-100"}`}
            src="/videos/hero.mp4"
            poster="/images/leca-do-balio/01-hero-fachada.jpg"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={() => setVideoEnded(true)}
          />
        )}

        <Image
          src="/images/leca-do-balio/01-hero-fachada.jpg"
          alt={t.hero.location}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${!autoplayVideo || videoEnded ? "opacity-100" : "opacity-0"}`}
        />

        {/* Legibilidade do texto sobre o vídeo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
        {/* Scrim: transição suave para a cor de fundo da secção seguinte, adapta-se ao tema */}
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-background to-transparent" />

        {autoplayVideo && !videoEnded && (
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

        <div
          ref={textRef}
          className="absolute bottom-8 left-6 md:bottom-12 md:left-12 text-white z-10 will-change-transform"
        >
          <p className="font-body text-xs tracking-[0.25em] uppercase opacity-80 mb-2">
            {t.hero.eyebrow}
          </p>
          <p className="font-display text-2xl md:text-3xl">{t.hero.location}</p>
        </div>
      </section>
    </div>
  );
}
