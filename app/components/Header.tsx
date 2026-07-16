"use client";

import { useLanguage } from "@/lib/language-context";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { locale, toggle, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
      <div className="font-display text-lg md:text-xl tracking-wide text-white drop-shadow-sm">
        Rui da Cruz
      </div>
      <div className="flex items-center gap-5 text-white">
        <button
          onClick={toggle}
          aria-label="Toggle language"
          className="text-lg leading-none hover:scale-110 transition-transform drop-shadow-sm"
          title={locale === "pt" ? "Switch to English" : "Mudar para Português"}
        >
          {locale === "pt" ? "🇬🇧" : "🇵🇹"}
        </button>
        <span className="opacity-30">·</span>
        <span className="drop-shadow-sm">
          <ThemeToggle />
        </span>
      </div>
    </header>
  );
}
