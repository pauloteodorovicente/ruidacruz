import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPropertyByReference } from "@/lib/properties";
import { Reveal } from "@/app/components/Reveal";
import { PortimaoGallery } from "@/app/components/portimao/PortimaoGallery";
import { PortimaoLeadForm } from "@/app/components/portimao/PortimaoLeadForm";
import { portimaoContent as c } from "@/lib/portimao-content";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  openGraph: {
    title: c.meta.title,
    description: c.meta.description,
    images: ["/images/portimao-praia-rocha/Apart T1 Praia_Rocha_4.jpeg"],
    locale: "pt_PT",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Apartamento T1 Praia da Rocha",
  description: c.meta.description,
  url: "https://ruidacruzconsultor.com/portimao-praia-da-rocha",
  image: "https://ruidacruzconsultor.com/images/portimao-praia-rocha/Apart T1 Praia_Rocha_4.jpeg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Estrada da Rocha — Edifício Alto da Foz, São Francisco 18",
    addressLocality: "Portimão",
    postalCode: "8500-804",
    addressCountry: "PT",
  },
};

const WHATSAPP_HREF = `https://wa.me/351939081583?text=${encodeURIComponent(c.whatsappMessage)}`;

export default async function PortimaoPage() {
  // Controle de publicação vem do registo em properties (ref
  // "portimao-praia-da-rocha") — mesmo padrão da Leça e do Verdelago.
  const property = await getPropertyByReference("portimao-praia-da-rocha");
  if (!property?.published) notFound();

  return (
    <div data-property-accent="marinho">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-6xl px-6 md:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-lg">Rui Da Cruz</Link>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.1em] uppercase text-accent hover:text-accent-strong transition-colors"
          >
            WhatsApp Direto
          </a>
        </div>
      </header>

      <main className="flex-1 bg-background text-foreground">
        {/* Hero */}
        <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden bg-black">
          <Image
            src="/images/portimao-praia-rocha/Apart T1 Praia_Rocha_4.jpeg"
            alt={c.hero.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />
          <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 text-white z-10 max-w-xl">
            <p className="text-xs tracking-[0.25em] uppercase opacity-80 mb-2">{c.hero.eyebrow}</p>
            <h1 className="font-display text-3xl md:text-5xl mb-3">{c.hero.title}</h1>
            <p className="text-sm md:text-base text-white/80">{c.hero.subtitle}</p>
          </div>
        </section>

        {/* Identificação */}
        <section className="px-6 py-14 md:px-12 md:py-20">
          <div className="mx-auto max-w-4xl">
            <Reveal className="block">
              <div className="flex flex-wrap gap-3 mb-6">
                {c.identification.tags.map((tag) => (
                  <span key={tag} className="text-[11px] tracking-[0.12em] uppercase px-3 py-1 border border-border text-foreground-muted">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-foreground-muted mb-8">{c.identification.address}</p>
              <dl className="grid grid-cols-3 gap-6 mb-10 max-w-md">
                {c.identification.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1">{spec.label}</dt>
                    <dd className="font-display text-lg">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className="block">
              <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{c.narrative.eyebrow}</p>
              <div className="flex flex-col gap-4">
                {c.narrative.paragraphs.map((p) => (
                  <p key={p} className="font-body text-base text-foreground-muted leading-relaxed max-w-2xl">{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Comodidades */}
        <section className="bg-background-raised px-6 py-14 md:px-12 md:py-20 border-y border-border">
          <Reveal className="mx-auto max-w-4xl block">
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-8">{c.amenities.eyebrow}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
              {c.amenities.items.map((item) => (
                <li key={item} className="font-body text-base text-foreground border-b border-border pb-4 flex items-start gap-3">
                  <span className="text-accent mt-1">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <PortimaoGallery />

        {/* Disponibilidade e valores */}
        <section className="px-6 py-14 md:px-12 md:py-20">
          <Reveal className="mx-auto max-w-3xl block">
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">{c.pricing.eyebrow}</p>
            <h2 className="font-display text-3xl md:text-4xl mb-4">{c.pricing.title}</h2>
            <p className="text-sm text-foreground-muted mb-1">{c.pricing.availability}</p>
            <p className="text-sm text-foreground-muted mb-1">{c.pricing.checkIn}</p>
            <p className="text-sm text-foreground-muted mb-8">{c.pricing.checkOut}</p>

            <div className="border border-border">
              {c.pricing.rows.map((row) => (
                <div key={row.period} className="flex items-center justify-between px-5 py-3.5 border-b border-border last:border-b-0 text-sm">
                  <span className="text-foreground-muted">{row.period}</span>
                  <span className="font-display text-accent">{row.price}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-foreground-muted/70 mt-4">{c.pricing.note}</p>
          </Reveal>
        </section>

        <PortimaoLeadForm />
      </main>

      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Direto"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-background shadow-lg transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.55-3.7 8.24-8.24 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.55 3.7-8.24 8.25-8.24Zm-4.2 4.62c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.03s.87 2.36.99 2.52c.12.16 1.7 2.72 4.2 3.7 2.08.82 2.5.66 2.95.62.45-.04 1.46-.6 1.66-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.46-.28-.24-.12-1.46-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.96-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.36-.77-1.86-.2-.48-.4-.42-.55-.43-.14-.01-.3-.01-.46-.01Z" />
        </svg>
      </a>

      <footer className="bg-background-raised border-t border-border px-6 py-10 md:px-12 text-center">
        <p className="text-xs text-foreground-muted">AMI 7772 · Prestígio Global – Sociedade de Mediação Imobiliária, S.A.</p>
        <p className="text-xs text-foreground-muted/70 mt-1">Representação exclusiva por Rui Da Cruz, RE/MAX Vantagem Platina.</p>
      </footer>
    </div>
  );
}
