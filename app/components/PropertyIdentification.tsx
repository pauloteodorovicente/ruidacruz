"use client";

import { useLanguage } from "@/lib/language-context";

export function PropertyIdentification() {
  const { t } = useLanguage();
  const i = t.identification;

  function scrollToForm() {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative bg-background px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
        <div className="md:col-span-3">
          <div className="flex gap-3 mb-6">
            {i.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] tracking-[0.12em] uppercase px-3 py-1 border border-border text-foreground-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-6">
            {i.title}
          </h1>
          <p className="font-body text-lg text-foreground-muted leading-relaxed max-w-xl">
            {i.lede}
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="md:sticky md:top-8 bg-background-raised border border-border p-8">
            <p className="font-display text-3xl mb-6">{i.price}</p>
            <dl className="grid grid-cols-2 gap-y-4 mb-8">
              {i.specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1">
                    {spec.label}
                  </dt>
                  <dd className="font-display text-lg">{spec.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3">
              <button
                onClick={scrollToForm}
                className="w-full py-3.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase hover:bg-accent-strong transition-colors"
              >
                {i.ctaPrimary}
              </button>
              <a
                href={`https://wa.me/351939081583?text=${encodeURIComponent(t.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 border border-border text-center font-body text-sm tracking-[0.05em] uppercase hover:border-accent hover:text-accent transition-colors"
              >
                {i.ctaWhatsapp}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
