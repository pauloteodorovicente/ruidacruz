"use client";

import { useLanguage } from "@/lib/language-context";

export function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer className="bg-[#040815] text-white/50 px-6 py-8 md:px-12 text-center text-xs leading-relaxed">
      <p>{f.rights}</p>
      <p className="mt-1">{f.ami}</p>
      <p className="mt-1">{f.whatsapp}</p>
    </footer>
  );
}
