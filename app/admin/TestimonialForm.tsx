"use client";

import { saveTestimonial } from "./testimonial-actions";
import type { Testimonial } from "@/lib/testimonials";

const inputClass =
  "w-full bg-transparent border border-border px-3 py-2.5 text-sm placeholder:text-foreground-muted focus:border-accent outline-none transition-colors";
const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1.5";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  return (
    <form action={saveTestimonial} className="flex flex-col gap-4">
      {testimonial && <input type="hidden" name="id" value={testimonial.id} />}

      <label className="block">
        <span className={labelClass}>Nome</span>
        <input name="author_name" defaultValue={testimonial?.author_name} required className={inputClass} />
      </label>

      <label className="block">
        <span className={labelClass}>Depoimento</span>
        <textarea name="quote" defaultValue={testimonial?.quote} required rows={5} className={inputClass} />
      </label>

      <label className="block">
        <span className={labelClass}>Fonte (opcional)</span>
        <input name="source" defaultValue={testimonial?.source ?? ""} placeholder="Google" className={inputClass} />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="featured" defaultChecked={testimonial?.featured ?? true} />
        <span className="text-sm">Exibir no site</span>
      </label>

      <button
        type="submit"
        className="self-start px-8 py-3.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong hover:-translate-y-0.5"
      >
        {testimonial ? "Guardar alterações" : "Adicionar depoimento"}
      </button>
    </form>
  );
}
