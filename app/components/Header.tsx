"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { ThemeToggle } from "./ThemeToggle";
import { FlagGB, FlagPT } from "./FlagIcon";

export function Header() {
  const { locale, toggle, t } = useLanguage();
  const [overHero, setOverHero] = useState(true);

  // Enquanto a hero está "presa" no topo (vídeo sempre escuro), o header fica
  // branco. Depois que solta, passa a usar a cor do tema (clara ou escura)
  // para continuar visível sobre o fundo da secção seguinte.
  useEffect(() => {
    let ticking = false;

    function update() {
      ticking = false;
      const wrapper = document.querySelector<HTMLElement>("[data-hero-wrapper]");
      if (!wrapper) return;
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
      <div className={`font-display text-lg md:text-xl tracking-wide ${overHero ? "drop-shadow-sm" : ""}`}>
        Rui Da Cruz
      </div>
      <div className="flex items-center gap-5">
        <button
          onClick={toggle}
          aria-label="Toggle language"
          className={`flex h-[18px] w-6 items-center justify-center overflow-hidden rounded-[2px] ring-1 ring-white/40 hover:scale-110 transition-transform ${overHero ? "drop-shadow-sm" : ""}`}
          title={locale === "pt" ? "Switch to English" : "Mudar para Português"}
        >
          {locale === "pt" ? <FlagGB className="h-full w-full" /> : <FlagPT className="h-full w-full" />}
        </button>
        <span className="opacity-30">·</span>
        <span className={`flex h-[18px] w-[18px] items-center justify-center ${overHero ? "drop-shadow-sm" : ""}`}>
          <ThemeToggle />
        </span>
      </div>
    </header>
  );
}
