import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { SiteFooter } from "@/app/components/site/SiteFooter";

// 404 no idioma de quem está navegando (o layout de cada idioma já gera o
// <html lang> certo). Qualquer endereço que não existe cai aqui via
// app/[locale]/[...rest]/page.tsx.
export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20 text-center">
        <div className="max-w-md">
          <p className="text-xs tracking-[0.25em] uppercase text-accent mb-3">404</p>
          <h1 className="font-display text-3xl md:text-4xl mb-4">{t("title")}</h1>
          <p className="text-foreground-muted mb-8">{t("text")}</p>
          <Link
            href="/"
            className="inline-block border border-border px-6 py-3 text-sm tracking-[0.08em] uppercase transition-all hover:border-accent hover:text-accent"
          >
            {t("cta")}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
