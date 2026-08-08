"use client";

import { useLeadForm } from "@/lib/use-lead-form";
import { PhoneField } from "../PhoneField";
import { Reveal } from "../Reveal";
import { portimaoContent as c } from "@/lib/portimao-content";

const PROPERTY = { reference: "portimao-praia-da-rocha", title: "Apartamento T1 Praia da Rocha", zone: "Portimão" };

export function PortimaoLeadForm() {
  const { status, handleSubmit } = useLeadForm(PROPERTY);
  const f = c.form;

  return (
    <section id="contacto" className="bg-[#040815] text-[#f5f3ef] px-6 pt-16 pb-28 md:px-12 md:py-24">
      <Reveal className="mx-auto max-w-xl text-center block">
        <p className="text-xs tracking-[0.25em] uppercase text-[#7b9bc4] mb-3">{f.eyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl mb-3">{f.title}</h2>
        <p className="text-sm text-white/60 mb-10">{f.subtitle}</p>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#7b9bc4]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7b9bc4" strokeWidth="2">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="font-display text-xl text-[#7b9bc4]">Recebido. O Rui Da Cruz entrará em contacto em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <input
              name="name"
              required
              placeholder="Nome"
              className="bg-transparent border border-white/20 px-4 py-3 text-sm placeholder:text-white/40 focus:border-[#7b9bc4] outline-none transition-colors"
            />
            <PhoneField locale="pt-PT" countryAriaLabel="Código do país" invalidMessage="Número incompleto para o país selecionado." />
            <textarea
              name="message"
              rows={3}
              placeholder="Mensagem (opcional) — datas de interesse, número de pessoas, etc."
              className="bg-transparent border border-white/20 px-4 py-3 text-sm placeholder:text-white/40 focus:border-[#7b9bc4] outline-none transition-colors resize-none"
            />
            <label className="flex items-start gap-2 text-[11px] text-white/50 leading-relaxed mt-1">
              <input type="checkbox" name="consent" required className="mt-0.5" />
              Concordo com o tratamento dos meus dados para fins de contacto comercial.
            </label>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 py-3.5 bg-[#7b9bc4] text-[#040815] font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-[#9db8d9] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#7b9bc4] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {status === "submitting" ? "A enviar…" : f.submit}
            </button>
            {status === "error" && (
              <p className="text-sm text-red-400 text-center">Não foi possível enviar. Tente novamente ou contacte via WhatsApp.</p>
            )}
          </form>
        )}
      </Reveal>
    </section>
  );
}
