"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const nav = useTranslations("siteNav");
  const f = useTranslations("siteFooter");

  return (
    <footer className="bg-[#040815] text-white/50 px-6 py-8 md:px-12 text-center text-xs leading-relaxed">
      <div className="flex justify-center gap-6 mb-4 text-[11px] tracking-[0.1em] uppercase">
        <Link href="/sobre" className="hover:text-white/80 transition-colors">
          {nav("sobre")}
        </Link>
        <Link href="/contacto" className="hover:text-white/80 transition-colors">
          {nav("contacto")}
        </Link>
      </div>
      <Image src="/images/rui/assinatura.png" alt="" width={72} height={63} className="mx-auto mb-3 h-10 w-auto opacity-90" />
      <p>{f("rights")}</p>
      <p className="mt-1">{f("ami")}</p>
      <p className="mt-1">{f("whatsapp")}</p>
    </footer>
  );
}
