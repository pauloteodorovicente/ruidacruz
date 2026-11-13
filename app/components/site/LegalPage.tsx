import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteWhatsAppFloating } from "@/app/components/site/SiteWhatsAppFloating";

type Section = { title: string; paragraphs: string[] };

// Termos e Política de Privacidade: páginas simples de leitura, sem destaque no menu (só no rodapé e no
// aceite do formulário de venda).
export async function LegalPage({ locale, kind }: { locale: string; kind: "terms" | "privacy" }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  const sections = t.raw(`${kind}.sections`) as Section[];

  return (
    <>
      <SiteHeader />
      <main className="flex-1 pt-32 pb-20">
        <article className="mx-auto max-w-3xl px-6">
          <h1 className="font-display text-3xl md:text-4xl mb-3">{t(`${kind}.title`)}</h1>
          <p className="text-xs text-foreground/50 mb-8">{t("updated")}</p>
          <p className="text-base leading-relaxed text-foreground/80 mb-10">{t(`${kind}.intro`)}</p>
          {sections.map((s) => (
            <section key={s.title} className="mb-8">
              <h2 className="font-display text-xl mb-3">{s.title}</h2>
              <div className="space-y-3 text-[15px] leading-relaxed text-foreground/75">
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </main>
      <SiteFooter />
      <SiteWhatsAppFloating />
    </>
  );
}
