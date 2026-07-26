"use client";

import { useLocale, useTranslations } from "next-intl";
import { useLeadForm, type LeadFormProperty } from "@/lib/use-lead-form";
import { PhoneField } from "@/app/components/PhoneField";
import { Reveal } from "@/app/components/Reveal";

type Heading = { eyebrow: string; title: string; subtitle: string; submitLabel?: string };

// Equivalente ao LeadForm.tsx original, mas para a árvore [locale] — mesmo
// motivo de não compartilhar componente que o SiteHeader/SiteFooter (ver
// nota em proxy.ts). heading opcional funciona igual: sem ele usa o
// texto padrão ("esta propriedade"); /contacto passa um texto genérico.
export function SiteLeadForm({ property, heading }: { property?: LeadFormProperty; heading?: Heading }) {
  const t = useTranslations("leadForm");
  const locale = useLocale();
  const h = heading ?? {
    eyebrow: t("defaultEyebrow"),
    title: t("defaultTitle"),
    subtitle: t("defaultSubtitle"),
    submitLabel: t("defaultSubmit"),
  };
  const { status, handleSubmit } = useLeadForm(property);

  return (
    <section id="contacto" className="bg-[#040815] text-[#f5f3ef] px-6 pt-16 pb-28 md:px-12 md:py-24">
      <Reveal className="mx-auto max-w-xl text-center block">
        <p className="text-xs tracking-[0.25em] uppercase text-[#ce946e] mb-3">{h.eyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-3">{h.title}</h2>
        <p className="text-sm text-white/60 mb-10">{h.subtitle}</p>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ce946e]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ce946e" strokeWidth="2">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="font-display text-xl text-[#ce946e]">{t("success")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <input
              name="name"
              required
              placeholder={t("name")}
              className="bg-transparent border border-white/20 px-4 py-3 text-sm placeholder:text-white/40 focus:border-[#ce946e] outline-none transition-colors"
            />
            <PhoneField locale={locale} countryAriaLabel={t("countryCode")} invalidMessage={t("phoneInvalid")} />
            <textarea
              name="message"
              rows={3}
              placeholder={t("message")}
              className="bg-transparent border border-white/20 px-4 py-3 text-sm placeholder:text-white/40 focus:border-[#ce946e] outline-none transition-colors resize-none"
            />
            <label className="flex items-start gap-2 text-[11px] text-white/50 leading-relaxed mt-1">
              <input type="checkbox" name="consent" required className="mt-0.5" />
              {t("consent")}
            </label>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 py-3.5 bg-[#ce946e] text-[#040815] font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-[#e0ab86] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#ce946e] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {status === "submitting" ? t("submitting") : (h.submitLabel ?? t("defaultSubmit"))}
            </button>
            {status === "error" && (
              <p className="text-sm text-red-400 text-center">{t("error")}</p>
            )}
          </form>
        )}
      </Reveal>
    </section>
  );
}
