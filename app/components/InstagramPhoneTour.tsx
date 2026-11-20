"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { trackLinkClick } from "@/lib/track-event";
import type { InstagramPost } from "@/lib/instagram";

export type InstagramTourCopy = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  follow: string;
  openPost: string;
  videoLabel: string;
  tapHint: string;
  steps: { title: string; text: string }[];
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// "Reduzir movimento" do sistema como valor reativo (sem setState dentro de effect).
function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const reducedMotionNow = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function TitleWithAccent({ title, accent }: { title: string; accent: string }) {
  const at = accent ? title.indexOf(accent) : -1;
  if (at < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, at)}
      <em className="text-accent">{accent}</em>
      {title.slice(at + accent.length)}
    </>
  );
}

function PostCard({ post, handle, avatar, openPost, videoLabel }: { post: InstagramPost; handle: string; avatar: string; openPost: string; videoLabel: string }) {
  return (
    <article className="pb-3">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
          <Image src={avatar} alt="" fill sizes="24px" className="object-cover" />
        </span>
        <span className="truncate text-[10px] font-medium text-white/90">{handle.replace("@", "")}</span>
        <span className="ml-auto text-[13px] leading-none tracking-widest text-white/50">···</span>
      </div>
      <a
        href={post.post_url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden
        onClick={() => trackLinkClick("instagram_post")}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-white/5"
      >
        <Image src={post.image_url} alt="" fill sizes="(max-width: 768px) 70vw, 300px" quality={75} loading="eager" draggable={false} className="object-cover" />
        {post.is_video && (
          <span title={videoLabel} className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-2.5 w-2.5 translate-x-[0.5px]">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        )}
      </a>
      <div className="flex items-center gap-3 px-3 pt-2 text-white/85">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden>
          <path d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 7.5 2.7c0 5.4-7.5 10-7.5 10z" />
        </svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden>
          <path d="M20.5 11.5a8.4 8.4 0 0 1-12.2 7.5L3.5 20.5l1.6-4.5A8.4 8.4 0 1 1 20.5 11.5z" />
        </svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden>
          <path d="M21 3 10 14M21 3l-6.5 18-3.5-7-7-3.5z" />
        </svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className="ml-auto h-[18px] w-[18px]" aria-hidden>
          <path d="M6 3.5h12v17l-6-4.5-6 4.5z" />
        </svg>
      </div>
      {post.caption && (
        <p className="px-3 pt-1.5 text-[10px] leading-snug text-white/75">
          <span className="font-medium text-white/95">{handle.replace("@", "")}</span> {post.caption}
        </p>
      )}
      <span className="sr-only">{openPost}</span>
    </article>
  );
}

// ── Mão segurando o celular (ilustração em SVG, coordenadas do corpo do celular: 304 x 640) ──
// Atrás do celular ficam o punho e os dedos que dão a volta na borda esquerda; na frente, o polegar
// (mão direita), que pivota na base e "rola" a tela. A parte que desce abaixo do celular some num
// degradê, como se a mão viesse de fora da cena.
const HAND_PIVOT = { x: 330, y: 640 };
const THUMB_ANGLE = { from: -12, to: 28 }; // graus: ponta embaixo/esquerda → ponta em cima/direita

function HandFade({ uid }: { uid: string }) {
  return (
    <defs>
      <linearGradient id={`${uid}-fadeg`} gradientUnits="userSpaceOnUse" x1="0" y1="640" x2="0" y2="770">
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#000" />
      </linearGradient>
      <mask id={`${uid}-fade`} maskUnits="userSpaceOnUse" x="-160" y="-60" width="640" height="960">
        <rect x="-160" y="-60" width="640" height="960" fill={`url(#${uid}-fadeg)`} />
      </mask>
      <linearGradient id={`${uid}-skin`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#dcb899" />
        <stop offset="1" stopColor="#b98a6c" />
      </linearGradient>
      <linearGradient id={`${uid}-shade`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#b88c70" />
        <stop offset="1" stopColor="#8d644d" />
      </linearGradient>
    </defs>
  );
}

function HandBack({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 304 640" aria-hidden className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full overflow-visible">
      <HandFade uid={uid} />
      <g mask={`url(#${uid}-fade)`}>
        {/* punho e palma, aparecem à direita e abaixo do celular */}
        <path d="M 226 460 C 332 460, 376 560, 370 690 L 356 840 L 100 840 L 92 600 C 92 520, 150 460, 226 460 Z" fill={`url(#${uid}-shade)`} />
        {/* dedos que dão a volta na borda esquerda */}
        <rect x="-30" y="232" width="58" height="50" rx="25" fill={`url(#${uid}-shade)`} />
        <rect x="-30" y="296" width="60" height="54" rx="27" fill={`url(#${uid}-shade)`} />
        <rect x="-28" y="364" width="56" height="50" rx="25" fill={`url(#${uid}-shade)`} />
        <rect x="-22" y="428" width="48" height="42" rx="21" fill={`url(#${uid}-shade)`} />
      </g>
    </svg>
  );
}

function HandFront({ uid, thumbRef }: { uid: string; thumbRef: React.RefObject<SVGGElement | null> }) {
  return (
    <svg
      viewBox="0 0 304 640"
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-30 h-full w-full overflow-visible"
      style={{ filter: "drop-shadow(0 10px 12px rgba(0,0,0,0.45))" }}
    >
      <HandFade uid={uid} />
      <g mask={`url(#${uid}-fade)`}>
        <g ref={thumbRef} transform={`rotate(${THUMB_ANGLE.from + 0.4 * (THUMB_ANGLE.to - THUMB_ANGLE.from)} ${HAND_PIVOT.x} ${HAND_PIVOT.y})`}>
          <g transform={`translate(${HAND_PIVOT.x} ${HAND_PIVOT.y}) rotate(221.4)`}>
            <rect x="-120" y="-25" width="366" height="50" rx="25" fill={`url(#${uid}-skin)`} stroke="rgba(70,35,15,0.4)" strokeWidth="1.5" />
            {/* unha e dobra da articulação */}
            <rect x="192" y="-15" width="38" height="30" rx="13" fill="#f0d8c6" opacity="0.8" />
            <path d="M 52 -22 Q 61 0 52 22" fill="none" stroke="rgba(70,35,15,0.28)" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </svg>
  );
}

// Seção "No Instagram" no estilo do tour do app (Fase 27): à esquerda o texto, com o passo ativo em
// destaque; à direita um celular que gira devagar enquanto os posts descem, tudo ligado à rolagem da
// página. No computador a cena fica fixa na tela por alguns "andares" de rolagem; no celular a página
// só passa por ela. Com "reduzir movimento" não há giro nem rolagem automática: o feed rola com o dedo.
export function InstagramPhoneTour({
  posts,
  copy,
  profileUrl,
  handle,
  avatar,
}: {
  posts: InstagramPost[];
  copy: InstagramTourCopy;
  profileUrl: string;
  handle: string;
  avatar: string;
}) {
  const reduced = useSyncExternalStore(subscribeReducedMotion, reducedMotionNow, () => false);
  const tourRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<SVGGElement>(null);
  const handUid = `ig${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const feedRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const stepCount = copy.steps.length;

  const update = useCallback(() => {
    const tour = tourRef.current;
    const device = deviceRef.current;
    const feed = feedRef.current;
    const viewport = viewportRef.current;
    if (!tour || !device || !feed || !viewport) return;

    let p = 0;
    if (!reduced) {
      const vh = window.innerHeight;
      if (window.matchMedia("(min-width: 768px)").matches) {
        const rect = tour.getBoundingClientRect();
        p = clamp(-rect.top / Math.max(1, rect.height - vh), 0, 1);
      } else {
        const rect = device.getBoundingClientRect();
        p = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
      }
    }

    const travel = Math.max(0, feed.scrollHeight - viewport.clientHeight);
    feed.style.transform = `translate3d(0, ${-p * travel}px, 0)`;
    const tilt = reduced ? 0 : (p - 0.5) * 2; // -1 (início) .. 1 (fim)
    const lift = reduced ? 1 : 0.97 + 0.05 * Math.sin(p * Math.PI);
    device.style.transform = `perspective(1600px) rotateY(${tilt * -10}deg) rotateZ(${tilt * 3.5}deg) scale(${lift})`;

    // Polegar: um "gesto de rolar" a cada ~280 px de feed — arrasta enquanto o feed sobe e, no fim de
    // cada gesto, volta rápido ao ponto de partida (levemente mais claro, como se levantasse do vidro).
    const thumb = thumbRef.current;
    if (thumb) {
      const swipes = clamp(Math.round(travel / 280), 3, 20);
      const phase = reduced ? 0.4 : p >= 1 ? 0.8 : (p * swipes) % 1;
      const drag = phase < 0.8 ? phase / 0.8 : 1 - (phase - 0.8) / 0.2;
      const angle = THUMB_ANGLE.from + (THUMB_ANGLE.to - THUMB_ANGLE.from) * drag;
      thumb.setAttribute("transform", `rotate(${angle.toFixed(2)} ${HAND_PIVOT.x} ${HAND_PIVOT.y})`);
      thumb.style.opacity = phase >= 0.8 && !reduced ? "0.78" : "1";
    }
    setActive(clamp(Math.floor(p * stepCount), 0, stepCount - 1));
  }, [reduced, stepCount]);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
      }
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [update]);

  return (
    <section id="instagram" aria-labelledby="instagram-title" className="bg-background">
      <div ref={tourRef} className={reduced ? "" : "md:h-[330vh]"}>
        <div className={`flex items-center px-6 py-16 md:px-12 ${reduced ? "md:py-24" : "md:sticky md:top-0 md:h-svh md:overflow-hidden md:py-0 md:pt-16"}`}>
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-accent">{copy.eyebrow}</p>
              <h2 id="instagram-title" className="mb-4 font-display text-4xl leading-[1.08] md:text-5xl">
                <TitleWithAccent title={copy.title} accent={copy.titleAccent} />
              </h2>
              <p className="mb-8 max-w-md text-sm text-foreground-muted">{copy.subtitle}</p>

              <ol className="mb-8 flex flex-col gap-1">
                {copy.steps.map((step, index) => {
                  const on = index === active;
                  return (
                    // O realce do passo ativo só existe no computador, onde a cena fica fixa e o texto acompanha
                    // o celular; no celular o texto passa antes do aparelho, então todos ficam iguais.
                    <li key={step.title} className={`border-l-2 border-border py-2 pl-5 transition-colors duration-500 ${on ? "md:border-accent" : ""}`}>
                      <p className={`font-display text-xl text-foreground transition-colors duration-500 md:text-2xl ${on ? "md:text-accent" : ""}`}>{step.title}</p>
                      <p className={`mt-0.5 max-w-md text-sm leading-relaxed text-foreground-muted transition-colors duration-500 ${on ? "md:text-foreground" : ""}`}>{step.text}</p>
                    </li>
                  );
                })}
              </ol>

              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${copy.follow} (${handle})`}
                onClick={() => trackLinkClick("instagram_perfil")}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs tracking-[0.05em] text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
                </svg>
                <span>{copy.follow}</span>
                <span className="hidden text-foreground-muted sm:inline">{handle}</span>
              </a>
              <p className="mt-4 hidden max-w-xs text-xs text-foreground-muted md:block">{copy.tapHint}</p>
            </div>

            <div className="relative mx-auto mb-16 w-[min(17rem,78%)] md:mb-0 md:w-[min(19rem,100%)]" style={{ perspective: "1600px" }}>
              <div ref={deviceRef} className="relative will-change-transform">
                <HandBack uid={handUid} />
                <div className="rounded-[2.4rem] bg-[#10141d] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_40px_80px_-30px_rgba(0,0,0,0.8)]">
                  <div className="relative aspect-[560/1214] overflow-hidden rounded-[1.9rem] bg-[#0a0d13]">
                    {/* ilha e barra de status */}
                    <span aria-hidden className="absolute left-1/2 top-2 z-20 h-[18px] w-[60px] -translate-x-1/2 rounded-full bg-black" />
                    <div aria-hidden className="absolute inset-x-0 top-0 z-10 flex h-9 items-end justify-between bg-[#0a0d13] px-6 pb-1 text-[9px] font-medium text-white/80">
                      <span>9:41</span>
                      <span className="tracking-widest">●●●</span>
                    </div>
                    {/* cabeçalho do app */}
                    <div aria-hidden className="absolute inset-x-0 top-9 z-10 flex h-8 items-center justify-between border-b border-white/10 bg-[#0a0d13] px-3">
                      <span className="font-display text-[15px] italic text-white/90">Instagram</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" className="h-[15px] w-[15px]">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </div>
                    {/* feed: sobe com a rolagem da página */}
                    <div ref={viewportRef} className={`absolute inset-x-0 bottom-0 top-[4.25rem] ${reduced ? "overflow-y-auto" : "overflow-hidden"}`}>
                      <div ref={feedRef} className="will-change-transform">
                        {posts.map((post) => (
                          <PostCard key={post.id} post={post} handle={handle} avatar={avatar} openPost={copy.openPost} videoLabel={copy.videoLabel} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <HandFront uid={handUid} thumbRef={thumbRef} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Para leitores de tela e teclado: os mesmos posts como lista de links simples. */}
      <ul className="sr-only">
        {posts.map((post) => (
          <li key={post.id}>
            <a href={post.post_url} target="_blank" rel="noopener noreferrer">
              {post.caption ? `${copy.openPost}: ${post.caption}` : copy.openPost}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
