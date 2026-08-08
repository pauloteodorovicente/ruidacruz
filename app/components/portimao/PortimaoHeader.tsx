"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePortimaoLanguage } from "@/lib/portimao-language-context";
import { ThemeToggle } from "../ThemeToggle";
import { LanguageFlagMenu } from "../LanguageFlagMenu";

export function PortimaoHeader() {
  const { locale, setLocale, t } = usePortimaoLanguage();
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    let ticking = false;

    function update() {
      ticking = false;
      const wrapper = document.querySelector<HTMLElement>("[data-hero-wrapper]");
      if (!wrapper) {
        setOverHero(false);
        return;
      }
      const pinRange = wrapper.offsetHeight - window.innerHeight;
      const scrolledPastHero = pinRange > 0 ? window.scrollY >= pinRange : window.scrollY > 0;
      setOverHero(!scrolledPastHero);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const colorClass = overHero ? "text-white" : "text-foreground";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 transition-colors duration-300 ${colorClass}`}
    >
      <Link href="/" className={`font-display text-lg md:text-xl tracking-wide ${overHero ? "drop-shadow-sm" : ""}`}>
        Rui Da Cruz
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-xs tracking-[0.1em] uppercase">
        <Link href="/sobre" className={`hover:text-accent transition-colors ${overHero ? "drop-shadow-sm" : ""}`}>
          {t.nav.sobre}
        </Link>
        <Link href="/contacto" className={`hover:text-accent transition-colors ${overHero ? "drop-shadow-sm" : ""}`}>
          {t.nav.contacto}
        </Link>
      </nav>
      <div className="flex items-center gap-5">
        <LanguageFlagMenu locale={locale} onSelect={setLocale} ariaLabel="Idioma" overHero={overHero} />
        <span className="opacity-30">·</span>
        <span className={`flex h-[18px] w-[18px] items-center justify-center ${overHero ? "drop-shadow-sm" : ""}`}>
          <ThemeToggle />
        </span>
      </div>
    </header>
  );
}
