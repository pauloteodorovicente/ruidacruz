"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export function Footer() {
  const { locale, t } = useLanguage();
  const f = t.footer;

  return (
    <footer className="bg-[#040815] text-white/50 px-6 py-8 md:px-12 text-center text-xs leading-relaxed">
      <div className="flex justify-center gap-6 mb-4 text-[11px] tracking-[0.1em] uppercase">
        <Link href="/sobre" className="hover:text-white/80 transition-colors">
          {locale === "pt" ? "Sobre" : "About"}
        </Link>
        <Link href="/contacto" className="hover:text-white/80 transition-colors">
          {locale === "pt" ? "Contacto" : "Contact"}
        </Link>
      </div>
      <p>{f.rights}</p>
      <p className="mt-1">{f.ami}</p>
      <p className="mt-1">{f.whatsapp}</p>
    </footer>
  );
}
