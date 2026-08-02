"use client";

import { useEffect, useRef, useState } from "react";

export const LANGUAGE_OPTIONS = [
  { code: "pt-PT", flag: "pt", native: "Português" },
  { code: "pt-BR", flag: "br", native: "Português (BR)" },
  { code: "en", flag: "gb", native: "English" },
  { code: "es", flag: "es", native: "Español" },
  { code: "fr", flag: "fr", native: "Français" },
  { code: "it", flag: "it", native: "Italiano" },
  { code: "de", flag: "de", native: "Deutsch" },
] as const;

// Dropdown de 7 idiomas usado nas landings de campanha (Leça do Balio,
// Verdelago) — essas páginas não passam pela rota [locale]/next-intl, então
// não podem usar o LanguageSwitcher institucional (que depende do router de
// locale). Mesmo visual, estado local via prop em vez de roteamento.
export function LanguageFlagMenu({
  locale,
  onSelect,
  ariaLabel,
  overHero,
}: {
  locale: string;
  onSelect: (code: (typeof LANGUAGE_OPTIONS)[number]["code"]) => void;
  ariaLabel: string;
  overHero?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = LANGUAGE_OPTIONS.find((l) => l.code === locale) ?? LANGUAGE_OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={ariaLabel}
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
          {LANGUAGE_OPTIONS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setOpen(false);
                onSelect(lang.code);
              }}
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
