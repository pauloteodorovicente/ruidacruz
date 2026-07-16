"use client";

import { useLanguage } from "@/lib/language-context";
import { useLeadForm } from "@/lib/use-lead-form";
import { Reveal } from "./Reveal";

export function LeadForm() {
  const { t } = useLanguage();
  const f = t.form;
  const { status, handleSubmit } = useLeadForm();

  return (
    <section id="contacto" className="bg-[#040815] text-[#f5f3ef] px-6 pt-16 pb-28 md:px-12 md:py-24">
      <Reveal className="mx-auto max-w-xl text-center block">
        <p className="text-xs tracking-[0.25em] uppercase text-[#ce946e] mb-3">{f.eyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-3">{f.title}</h2>
        <p className="text-sm text-white/60 mb-10">{f.subtitle}</p>

        {status === "success" ? (
          <p className="font-display text-xl text-[#ce946e] py-8">{f.success}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <input
              name="name"
              required
              placeholder={f.name}
              className="bg-transparent border border-white/20 px-4 py-3 text-sm placeholder:text-white/40 focus:border-[#ce946e] outline-none transition-colors"
            />
            <input
              name="phone"
              required
              placeholder={f.phone}
              className="bg-transparent border border-white/20 px-4 py-3 text-sm placeholder:text-white/40 focus:border-[#ce946e] outline-none transition-colors"
            />
            <textarea
              name="message"
              rows={3}
              placeholder={f.message}
              className="bg-transparent border border-white/20 px-4 py-3 text-sm placeholder:text-white/40 focus:border-[#ce946e] outline-none transition-colors resize-none"
            />
            <label className="flex items-start gap-2 text-[11px] text-white/50 leading-relaxed mt-1">
              <input type="checkbox" name="consent" required className="mt-0.5" />
              {f.consent}
            </label>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 py-3.5 bg-[#ce946e] text-[#040815] font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-[#e0ab86] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#ce946e] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {status === "submitting" ? f.submitting : f.submit}
            </button>
            {status === "error" && (
              <p className="text-sm text-red-400 text-center">{f.error}</p>
            )}
          </form>
        )}
      </Reveal>
    </section>
  );
}
