"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";

const YT_VIDEO_ID = "1n12iQxzJj0";

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          playerVars: Record<string, number | string>;
          events: {
            onReady: (e: { target: YTPlayer }) => void;
            onStateChange: (e: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: { ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
};

export function Hero() {
  const { t } = useLanguage();
  const playerElRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [muted, setMuted] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    function createPlayer() {
      if (!playerElRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(playerElRef.current, {
        videoId: YT_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          cc_load_policy: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
          },
          onStateChange: (e) => {
            if (window.YT && e.data === window.YT.PlayerState.ENDED) {
              setVideoEnded(true);
            }
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    }
  }, []);

  function toggleSound() {
    const player = playerRef.current;
    if (!player) return;
    if (player.isMuted()) {
      player.unMute();
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  }

  return (
    <div className="relative h-[160vh]">
      <section className="sticky top-0 h-[75vh] min-h-[520px] w-full overflow-hidden bg-black">
        {/* Vídeo escalado 1.3x e ancorado no topo (não centralizado): empurra a legenda
            queimada no rodapé do arquivo original para fora da área visível. */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full origin-top scale-y-[1.3] pointer-events-none">
          <div ref={playerElRef} className="h-full w-full" />
        </div>

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
