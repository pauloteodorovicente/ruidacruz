"use client";

import Image from "next/image";
import Link from "next/link";
import { usePortimaoLanguage } from "@/lib/portimao-language-context";

export function PortimaoFooter() {
  const { t } = usePortimaoLanguage();

  return (
    <footer className="bg-[#040815] text-white/50 px-6 py-8 md:px-12 text-center text-xs leading-relaxed">
      <div className="flex justify-center gap-6 mb-4 text-[11px] tracking-[0.1em] uppercase">
        <Link href="/sobre" className="hover:text-white/80 transition-colors">
          {t.nav.sobre}
        </Link>
        <Link href="/contacto" className="hover:text-white/80 transition-colors">
          {t.nav.contacto}
        </Link>
      </div>
      <Image src="/images/rui/assinatura.png" alt="" width={63} height={72} className="mx-auto mb-3 h-10 w-auto opacity-90" />
      <p>Representação exclusiva por Rui Da Cruz, RE/MAX Vantagem Platina.</p>
      <p className="mt-1">AMI 7772 · Prestígio Global – Sociedade de Mediação Imobiliária, S.A.</p>
      <p className="mt-1">+351 939 081 583</p>
    </footer>
  );
}
