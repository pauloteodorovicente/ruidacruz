import { getTranslations } from "next-intl/server";
import { Reveal } from "@/app/components/Reveal";
import { InstagramProfileLink, InstagramTile } from "@/app/components/InstagramLinks";
import { InstagramPhoneTour } from "@/app/components/InstagramPhoneTour";
import { getInstagramSettings } from "@/lib/settings";
import { getInstagramPosts } from "@/lib/instagram-posts";
import { instagramHandle } from "@/lib/instagram";
import { BUSINESS_INFO } from "@/lib/business-info";

// Seção "No Instagram" da Home (Fase 27): publicações escolhidas à mão no admin (Admin → Instagram),
// sem API do Instagram. Liga/desliga, layout (galeria fixa ou carrossel infinito) e limite de posts
// também vêm do admin. Desligada, ou sem nenhum post, a seção não aparece.
//
// Carrossel: a fita repete os posts o bastante para cobrir uma tela larga e depois dobra, para o laço
// ser contínuo (translateX de -50% no CSS, ver globals.css). Com "reduzir movimento" a fita para e vira
// uma faixa que se rola com o dedo.
const MIN_HALF_WIDTH_PX = 2600;
const CAROUSEL_TILE_PX = 252; // 240 de quadrado + 12 de espaço, o maior caso

export async function InstagramSection({ locale }: { locale: string }) {
  const settings = await getInstagramSettings();
  if (!settings.enabled) return null;

  const posts = (await getInstagramPosts()).slice(0, settings.maxPosts);
  if (posts.length === 0) return null;

  const t = await getTranslations({ locale, namespace: "home.instagram" });
  const profileUrl = BUSINESS_INFO.instagramUrl;
  const handle = instagramHandle(profileUrl);
  const tileProps = { label: t("openPost"), videoLabel: t("video") };

  // Celular animado (padrão): texto à esquerda e celular que gira com os posts descendo ao rolar.
  if (settings.layout === "phone") {
    return (
      <InstagramPhoneTour
        posts={posts}
        profileUrl={profileUrl}
        handle={handle}
        avatar="/images/rui/rui-cruz.jpg"
        copy={{
          eyebrow: t("eyebrow"),
          title: t("title"),
          titleAccent: t("titleAccent"),
          subtitle: t("subtitle"),
          follow: t("follow"),
          openPost: t("openPost"),
          videoLabel: t("video"),
          tapHint: t("tapHint"),
          steps: [1, 2, 3, 4].map((n) => ({ title: t(`step${n}Title`), text: t(`step${n}Text`) })),
        }}
      />
    );
  }

  let carouselItems: { post: (typeof posts)[number]; duplicate: boolean }[] = [];
  let duration = 40;
  if (settings.layout === "carousel") {
    const repeats = Math.max(1, Math.ceil(MIN_HALF_WIDTH_PX / (posts.length * CAROUSEL_TILE_PX)));
    const half = Array.from({ length: repeats }, (_, round) => posts.map((post) => ({ post, duplicate: round > 0 })));
    const first = half.flat();
    carouselItems = [...first, ...first.map((item) => ({ ...item, duplicate: true }))];
    duration = Math.max(30, first.length * 4);
  }

  return (
    <section id="instagram" aria-labelledby="instagram-title" className="bg-background px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-10 block max-w-xl text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-accent">{t("eyebrow")}</p>
          <h2 id="instagram-title" className="mb-3 font-display text-3xl md:text-4xl">
            {t("title")}
          </h2>
          <p className="mb-6 text-sm text-foreground-muted">{t("subtitle")}</p>
          <InstagramProfileLink href={profileUrl} handle={handle} label={t("follow")} />
        </Reveal>

        {settings.layout === "grid" && (
          <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            {posts.map((post) => (
              <li key={post.id}>
                <InstagramTile post={post} variant="grid" {...tileProps} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {settings.layout === "carousel" && (
        <div className="ig-marquee mx-auto max-w-[1800px]" style={{ "--ig-duration": `${duration}s` } as React.CSSProperties}>
          <ul className="ig-marquee-track">
            {carouselItems.map(({ post, duplicate }, index) => (
              <li key={`${post.id}-${index}`} className={duplicate ? "ig-dup" : undefined} aria-hidden={duplicate || undefined}>
                <InstagramTile post={post} variant="carousel" duplicate={duplicate} {...tileProps} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
