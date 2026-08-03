"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const LANGUAGES: { code: AppLocale; flag: string; native: string }[] = [
  { code: "pt-PT", flag: "pt", native: "Português" },
  { code: "pt-BR", flag: "br", native: "Português (BR)" },
  { code: "en", flag: "gb", native: "English" },
  { code: "es", flag: "es", native: "Español" },
  { code: "fr", flag: "fr", native: "Français" },
  { code: "it", flag: "it", native: "Italiano" },
  { code: "de", flag: "de", native: "Deutsch" },
];

// Substitui o toggle binário PT/EN da Leça do Balio nas páginas
// institucionais — 7 idiomas, dropdown com bandeira + nome nativo. Troca de
// idioma preserva a página atual (usa o pathname localizado do next-intl).
export function LanguageSwitcher({ overHero }: { overHero?: boolean }) {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  function select(code: AppLocale) {
    setOpen(false);
    // scroll:false — trocar de idioma não deve mover o usuário nem um
    // milímetro na página, só re-renderiza o texto no lugar.
    router.replace(pathname, { locale: code, scroll: false });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("label")}
        aria-expanded={open}
        className={`flex items-center gap-1.5 hover:scale-105 transition-transform ${overHero ? "drop-shadow-sm" : ""}`}
      >
        <img src={`/flags/${current.flag}.svg`} alt="" className="h-[13px] w-[18px] object-cover" />
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" className="opacity-60">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-background-raised border border-border shadow-lg z-50 text-foreground">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => select(lang.code)}
              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm hover:bg-background transition-colors ${
                lang.code === locale ? "text-accent" : ""
              }`}
            >
              <img src={`/flags/${lang.flag}.svg`} alt="" className="h-[13px] w-[18px] object-cover shrink-0" />
              {lang.native}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
