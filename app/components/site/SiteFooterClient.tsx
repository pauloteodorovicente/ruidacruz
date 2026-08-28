"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BUSINESS_INFO } from "@/lib/business-info";

// Handle hardcoded aqui de propósito — lib/business-info.ts (Fase 21) ainda
// não existe nesta branch (baseada direto na main). Quando a Fase 21 for
// mesclada, trocar por BUSINESS_INFO.instagramUrl pra ter uma fonte só.
const INSTAGRAM_URL = "https://www.instagram.com/ruidacruz_yourbestchoice/";

export function SiteFooterClient({ sellerCtaEnabled }: { sellerCtaEnabled: boolean }) {
  const nav = useTranslations("siteNav");
  const f = useTranslations("siteFooter");

  return (
    <footer className="bg-[#040815] text-white/50 px-6 py-8 md:px-12 text-center text-xs leading-relaxed">
      <Image src="/images/rui/assinatura.png" alt="" width={63} height={72} className="mx-auto mb-5 h-14 w-auto opacity-90" />
      <div className="flex justify-center gap-6 mb-4 text-[11px] tracking-[0.1em] uppercase">
        <Link href="/sobre" className="hover:text-white/80 transition-colors">
          {nav("sobre")}
        </Link>
        {sellerCtaEnabled && (
          <Link href="/vender" className="text-accent hover:text-accent-strong transition-colors">
            {nav("vender")}
          </Link>
        )}
        <Link href="/contacto" className="hover:text-white/80 transition-colors">
          {nav("contacto")}
        </Link>
        <Link href="/guia-comprador-estrangeiro" className="hover:text-white/80 transition-colors">
          {nav("guia")}
        </Link>
        <Link href="/faq" className="hover:text-white/80 transition-colors">
          {nav("faq")}
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
      <p>{f("rights")}</p>
      <p className="mt-1">{f("ami")}</p>
      <p className="mt-1">{f("whatsapp")}</p>
      <p className="mt-1">
        {BUSINESS_INFO.streetAddress}, {BUSINESS_INFO.postalCode} {BUSINESS_INFO.addressLocality}
      </p>
    </footer>
  );
}
