"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useLeadForm } from "@/lib/use-lead-form";
import { PhoneField } from "@/app/components/PhoneField";

const PROPERTY = { reference: "vender-imovel", title: "Quero Vender o Meu Imóvel", zone: null };
const ITEM_COUNT = 5;

const inputClass =
  "bg-transparent border border-foreground/20 px-4 py-3 text-sm placeholder:text-foreground/40 focus:border-accent outline-none transition-colors w-full";

// Página "Senhor proprietário Está a Pensar Vender?" (pedido do Rui no grupo, 11/11): artigo sobre os
// documentos para vender e um botão que abre um formulário (nome, e-mail, telefone, observações).
export function VenderContent() {
  const v = useTranslations("vender");
  const t = useTranslations("leadForm");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const { status, handleSubmit } = useLeadForm(PROPERTY);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstField.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const cta = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="inline-block bg-accent px-8 py-4 text-sm tracking-[0.08em] uppercase text-background transition-all hover:bg-accent-strong hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
    >
      {v("cta")}
    </button>
  );

  return (
    <>
      <article className="mx-auto max-w-3xl px-6">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-3 text-center">{v("eyebrow")}</p>
        <h1 className="font-display text-3xl md:text-5xl text-center mb-12">{v("title")}</h1>

        <h2 className="font-display text-2xl md:text-3xl mb-6">{v("article.headline")}</h2>
        <div className="space-y-5 text-base leading-relaxed text-foreground/80">
          <p>{v("article.p1")}</p>
          <p className="font-display text-xl text-foreground">{v("article.p2")}</p>
          <p>{v("article.p3")}</p>
        </div>

        <h3 className="font-display text-xl md:text-2xl mt-12 mb-6">{v("article.listTitle")}</h3>
        <ol className="space-y-7">
          {Array.from({ length: ITEM_COUNT }, (_, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-display text-2xl text-accent leading-none pt-0.5">{i + 1}</span>
              <div>
                <p className="font-display text-lg text-foreground">{v(`article.items.${i}.title`)}</p>
                <p className="mt-1.5 text-base leading-relaxed text-foreground/75">{v(`article.items.${i}.text`)}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 border-l-2 border-accent pl-6">
          <h3 className="font-display text-xl md:text-2xl mb-4">{v("article.detailTitle")}</h3>
          <div className="space-y-4 text-base leading-relaxed text-foreground/80">
            <p>{v("article.detail1")}</p>
            <p>{v("article.detail2")}</p>
          </div>
          <p className="mt-5 font-display text-lg text-accent">{v("article.closing")}</p>
        </div>

        <h3 className="font-display text-xl md:text-2xl mt-14 mb-4">{v("article.askTitle")}</h3>
        <div className="space-y-4 text-base leading-relaxed text-foreground/80">
          <p>{v("article.ask1")}</p>
          <p>{v("article.ask2")}</p>
        </div>

        <div className="mt-14 rounded-lg border border-border bg-background-raised px-6 py-10 text-center">
          <h3 className="font-display text-2xl mb-3">{v("article.ctaTitle")}</h3>
          <p className="mx-auto mb-7 max-w-xl text-sm text-foreground/70">{v("article.ctaText")}</p>
          {cta}
        </div>
      </article>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={v("cta")}
            className="relative max-h-full w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-background px-6 py-8 text-foreground md:px-9"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={v("form.close")}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:text-accent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
            <h2 className="font-display text-2xl mb-6 pr-8">{v("cta")}</h2>

            {status === "success" ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent text-accent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="text-center font-display text-xl text-accent">{t("success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                <input ref={firstField} name="name" required placeholder={t("name")} className={inputClass} />
                <input name="email" type="email" required placeholder={v("form.email")} className={inputClass} />
                <PhoneField
                  locale={locale}
                  countryAriaLabel={t("countryCode")}
                  invalidMessage={t("phoneInvalid")}
                  tone="theme"
                />
                <textarea
                  name="message"
                  rows={4}
                  placeholder={v("form.notes")}
                  className={`${inputClass} resize-none`}
                />
                <label className="flex items-start gap-2 text-[11px] text-foreground/50 leading-relaxed mt-1">
                  <input type="checkbox" name="consent" required className="mt-0.5" />
                  {t("consent")}
                </label>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-2 py-3.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? t("submitting") : v("form.submit")}
                </button>
                {status === "error" && (
                  <p className="text-sm text-red-400 light:text-red-700 text-center">{t("error")}</p>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
