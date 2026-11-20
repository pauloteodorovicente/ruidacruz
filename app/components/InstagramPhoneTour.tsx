"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
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

// ── Mão segurando o celular: foto real recortada (fundo verde e tela magenta viraram transparência) ──
// Duas camadas em public/images/instagram: "phone-hand" (celular + mão, tela vazada, o polegar sai
// daqui) e "phone-thumb" (só a ponta do polegar, que pivota na emenda para "rolar" a tela).
// Medidas em pixels da foto original (941 x 1672).
const PHOTO = { w: 941, h: 1672 };
const SCREEN = { x: 185, y: 241, w: 569, h: 1189 }; // área da tela
const BLEED = 14; // a tela passa 14 px por baixo da moldura, para não sobrar fresta
const THUMB = { x: 471, y: 957, w: 320, h: 245, pivotX: 690, pivotY: 1078 };
const THUMB_ANGLE = { from: -3, to: 12 }; // graus (positivo = ponta do polegar sobe)
const UI_W = 281; // largura de projeto da tela do app, em px de CSS; é escalada para a largura real
const UI_H = Math.round((UI_W * SCREEN.h) / SCREEN.w);
const pct = (value: number, total: number) => `${(value / total) * 100}%`;

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
  const thumbRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
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

    // a tela do app é desenhada em 281 px de largura e escalada para caber na tela da foto
    const ui = uiRef.current;
    if (ui) ui.style.transform = `scale(${((device.clientWidth * SCREEN.w) / PHOTO.w / UI_W).toFixed(4)})`;

    const travel = Math.max(0, feed.scrollHeight - viewport.clientHeight);
    feed.style.transform = `translate3d(0, ${-p * travel}px, 0)`;
    const tilt = reduced ? 0 : (p - 0.5) * 2; // -1 (início) .. 1 (fim)
    const lift = reduced ? 1 : 0.97 + 0.05 * Math.sin(p * Math.PI);
    device.style.transform = `perspective(1600px) rotateY(${tilt * -8}deg) rotateZ(${tilt * 2.5}deg) scale(${lift})`;

    // Polegar: um "gesto de rolar" a cada ~280 px de feed — arrasta enquanto o feed sobe e, no fim de
    // cada gesto, volta rápido ao ponto de partida.
    const thumb = thumbRef.current;
    if (thumb) {
      const swipes = clamp(Math.round(travel / 280), 3, 20);
      const phase = reduced ? 0.4 : p >= 1 ? 0.8 : (p * swipes) % 1;
      const drag = phase < 0.8 ? phase / 0.8 : 1 - (phase - 0.8) / 0.2;
      thumb.style.transform = `rotate(${(THUMB_ANGLE.from + (THUMB_ANGLE.to - THUMB_ANGLE.from) * drag).toFixed(2)}deg)`;
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

  useLayoutEffect(() => {
    const device = deviceRef.current;
    const ui = uiRef.current;
    if (device && ui) ui.style.transform = `scale(${((device.clientWidth * SCREEN.w) / PHOTO.w / UI_W).toFixed(4)})`;
  }, []);

  return (
    <section id="instagram" aria-labelledby="instagram-title" className="bg-background">
      <div ref={tourRef} className={reduced ? "" : "md:h-[330vh]"}>
        <div className={`flex items-center px-6 py-16 md:px-12 ${reduced ? "md:py-24" : "md:sticky md:top-0 md:h-svh md:overflow-hidden md:py-0 md:pt-16"}`}>
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-accent tiny:mb-2">{copy.eyebrow}</p>
              <h2 id="instagram-title" className="mb-4 font-display text-4xl leading-[1.08] md:text-5xl short:mb-3 short:text-4xl tiny:text-3xl">
                <TitleWithAccent title={copy.title} accent={copy.titleAccent} />
              </h2>
              <p className="mb-8 max-w-md text-sm text-foreground-muted short:mb-5">{copy.subtitle}</p>

              <ol className="mb-8 flex flex-col gap-1 short:mb-5">
                {copy.steps.map((step, index) => {
                  const on = index === active;
                  return (
                    // O realce do passo ativo só existe no computador, onde a cena fica fixa e o texto acompanha
                    // o celular; no celular o texto passa antes do aparelho, então todos ficam iguais.
                    <li key={step.title} className={`border-l-2 border-border py-2 pl-5 transition-colors duration-500 short:py-1.5 ${on ? "md:border-accent" : ""}`}>
                      <p className={`font-display text-xl text-foreground transition-colors duration-500 md:text-2xl short:text-xl ${on ? "md:text-accent" : ""}`}>{step.title}</p>
                      {/* Em janela baixa só o passo ativo mostra a descrição (a linha abre e fecha); nas altas todos mostram. */}
                      <div className={`grid transition-[grid-template-rows,opacity] duration-500 ${on ? "" : "short:grid-rows-[0fr] short:opacity-0"}`}>
                        <p className={`mt-0.5 min-h-0 max-w-md overflow-hidden text-sm leading-relaxed text-foreground-muted transition-colors duration-500 ${on ? "md:text-foreground" : ""}`}>{step.text}</p>
                      </div>
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
              <p className="mt-4 hidden max-w-xs text-xs text-foreground-muted md:block short:hidden">{copy.tapHint}</p>
            </div>

            {/* Celular na mão (foto real): a tela do app fica ATRÁS da foto, que tem a tela vazada. */}
            <div className="relative mx-auto -my-10 w-[min(22rem,92%)] md:my-0 md:w-[min(29rem,100%,calc((100svh-1rem)*0.5628))]" style={{ perspective: "1600px" }}>
              <div ref={deviceRef} className="relative aspect-[941/1672] will-change-transform">
                <div
                  className="absolute overflow-hidden bg-[#0a0d13]"
                  style={{ left: pct(SCREEN.x - BLEED, PHOTO.w), top: pct(SCREEN.y - BLEED, PHOTO.h), width: pct(SCREEN.w + BLEED * 2, PHOTO.w), height: pct(SCREEN.h + BLEED * 2, PHOTO.h) }}
                >
                  <div
                    ref={uiRef}
                    className="absolute origin-top-left"
                    style={{ left: pct(BLEED, SCREEN.w + BLEED * 2), top: pct(BLEED, SCREEN.h + BLEED * 2), width: UI_W, height: UI_H }}
                  >
                    <div className="relative h-full w-full overflow-hidden">
                      {/* barra de status */}
                      <div aria-hidden className="absolute inset-x-0 top-0 z-10 flex h-8 items-end justify-between bg-[#0a0d13] px-7 pb-1 text-[9px] font-medium text-white/80">
                        <span>9:41</span>
                        <span className="tracking-widest">●●●</span>
                      </div>
                      {/* cabeçalho do app */}
                      <div aria-hidden className="absolute inset-x-0 top-8 z-10 flex h-8 items-center justify-between border-b border-white/10 bg-[#0a0d13] px-3">
                        <span className="font-display text-[15px] italic text-white/90">Instagram</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" className="h-[15px] w-[15px]">
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                      </div>
                      {/* feed: sobe com a rolagem da página */}
                      <div ref={viewportRef} className={`absolute inset-x-0 bottom-0 top-16 ${reduced ? "overflow-y-auto" : "overflow-hidden"}`}>
                        <div ref={feedRef} className="will-change-transform">
                          {posts.map((post) => (
                            <PostCard key={post.id} post={post} handle={handle} avatar={avatar} openPost={copy.openPost} videoLabel={copy.videoLabel} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* foto: celular + mão (tela transparente) */}
                <Image src="/images/instagram/phone-hand.webp" alt="" width={PHOTO.w} height={PHOTO.h} unoptimized draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none" />

                {/* ponta do polegar: pivota na emenda e "rola" a tela */}
                <div
                  ref={thumbRef}
                  aria-hidden
                  className="pointer-events-none absolute will-change-transform"
                  style={{
                    left: pct(THUMB.x, PHOTO.w),
                    top: pct(THUMB.y, PHOTO.h),
                    width: pct(THUMB.w, PHOTO.w),
                    height: pct(THUMB.h, PHOTO.h),
                    transformOrigin: `${((THUMB.pivotX - THUMB.x) / THUMB.w) * 100}% ${((THUMB.pivotY - THUMB.y) / THUMB.h) * 100}%`,
                  }}
                >
                  <Image src="/images/instagram/phone-thumb.webp" alt="" width={THUMB.w} height={THUMB.h} unoptimized draggable={false} className="h-full w-full select-none" />
                </div>
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
