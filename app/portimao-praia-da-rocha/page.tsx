import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPropertyByReference } from "@/lib/properties";
import { Reveal } from "@/app/components/Reveal";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { PortimaoGallery } from "@/app/components/portimao/PortimaoGallery";
import { PortimaoLeadForm } from "@/app/components/portimao/PortimaoLeadForm";
import { PortimaoWhatsAppFloating } from "@/app/components/portimao/PortimaoWhatsAppFloating";
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
          <Link href="/" className="font-display text-lg tracking-wide">Rui Da Cruz</Link>
          <nav className="flex items-center gap-6 text-xs tracking-[0.1em] uppercase">
            <Link href="/sobre" className="hover:text-accent transition-colors">Sobre</Link>
            <Link href="/contacto" className="hover:text-accent transition-colors">Contacto</Link>
            <span className="opacity-30">·</span>
            <ThemeToggle />
          </nav>
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

      <PortimaoWhatsAppFloating />

      <footer className="bg-background-raised border-t border-border px-6 py-10 md:px-12 text-center">
        <p className="text-xs text-foreground-muted">AMI 7772 · Prestígio Global – Sociedade de Mediação Imobiliária, S.A.</p>
        <p className="text-xs text-foreground-muted/70 mt-1">Representação exclusiva por Rui Da Cruz, RE/MAX Vantagem Platina.</p>
      </footer>
    </div>
  );
}
