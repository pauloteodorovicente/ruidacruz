"use client";

import Image from "next/image";
import { trackLinkClick } from "@/lib/track-event";
import type { InstagramPost } from "@/lib/instagram";

const GLYPH = (
  <>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
  </>
);

// Um post em destaque. Abre a publicação no Instagram em outra aba e conta o clique no painel de
// Analytics ("instagram_post"). Na galeria o quadrado se ajusta à coluna; no carrossel tem tamanho fixo.
// `duplicate` marca as cópias que fecham o laço do carrossel: escondidas de leitores de tela e do teclado.
export function InstagramTile({
  post,
  variant,
  label,
  videoLabel,
  duplicate = false,
}: {
  post: InstagramPost;
  variant: "grid" | "carousel";
  label: string;
  videoLabel: string;
  duplicate?: boolean;
}) {
  const size = variant === "carousel" ? "h-[200px] w-[200px] md:h-[240px] md:w-[240px]" : "aspect-square w-full";
  return (
    <a
      href={post.post_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={post.caption ? `${label}: ${post.caption}` : label}
      tabIndex={duplicate ? -1 : undefined}
      onClick={() => trackLinkClick("instagram_post")}
      className={`group relative block overflow-hidden rounded-[3px] bg-background-raised outline-none focus-visible:ring-2 focus-visible:ring-accent ${size}`}
    >
      <Image
        src={post.image_url}
        alt=""
        fill
        sizes={variant === "carousel" ? "240px" : "(max-width: 768px) 50vw, 25vw"}
        quality={75}
        draggable={false}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <span aria-hidden className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/25" />
      {post.is_video && (
        <span
          title={videoLabel}
          aria-hidden
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 translate-x-[1px]">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      )}
      {post.caption && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2.5 pt-10 text-[11px] leading-snug tracking-wide text-white/90 transition-all duration-500 line-clamp-3 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
          {post.caption}
        </span>
      )}
    </a>
  );
}

// "@perfil" com o ícone, no topo da seção. Leva ao perfil do Rui no Instagram.
export function InstagramProfileLink({ href, handle, label }: { href: string; handle: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (${handle})`}
      onClick={() => trackLinkClick("instagram_perfil")}
      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs tracking-[0.05em] text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        {GLYPH}
      </svg>
      <span>{label}</span>
      <span className="text-foreground-muted">{handle}</span>
    </a>
  );
}
