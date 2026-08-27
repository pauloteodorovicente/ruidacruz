"use client";

import Image from "next/image";
import Link from "next/link";
import { useOneGreenwayLanguage } from "@/lib/onegreenway-language-context";

// Handle igual ao usado no SiteFooter — ver app/components/site/SiteFooter.tsx
const INSTAGRAM_URL = "https://www.instagram.com/ruidacruz_yourbestchoice/";

export function OneGreenwayFooter() {
  const { t } = useOneGreenwayLanguage();

  return (
    <footer className="bg-[#040815] text-white/50 px-6 py-8 md:px-12 text-center text-xs leading-relaxed">
      <div className="flex justify-center gap-6 mb-4 text-[11px] tracking-[0.1em] uppercase">
        <Link href="/sobre" className="hover:text-white/80 transition-colors">
          {t.nav.sobre}
        </Link>
        <Link href="/contacto" className="hover:text-white/80 transition-colors">
          {t.nav.contacto}
        </Link>
        <Link href="/guia-comprador-estrangeiro" className="hover:text-white/80 transition-colors">
          {t.nav.guia}
        </Link>
        <Link href="/faq" className="hover:text-white/80 transition-colors">
          {t.nav.faq}
        </Link>
      </div>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="inline-flex mb-4 text-white/50 hover:text-white/80 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      </a>
      <Image src="/images/rui/assinatura.png" alt="" width={63} height={72} className="mx-auto mb-3 h-10 w-auto opacity-90" />
      <p>Representação por Rui Da Cruz, RE/MAX Vantagem Platina.</p>
      <p className="mt-1">AMI 7772 · Prestígio Global – Sociedade de Mediação Imobiliária, S.A.</p>
      <p className="mt-1">+351 939 081 583</p>
    </footer>
  );
}
