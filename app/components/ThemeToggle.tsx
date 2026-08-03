"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
    // Aplica direto no body via inline style, além da classe utilitária: em
    // alguns navegadores o background-color do <body> (via var() herdada de
    // um atributo no <html>) não invalida corretamente numa troca em tempo
    // de execução — o valor computado fica "preso" no tema inicial mesmo
    // com a custom property e outros elementos atualizando certinho. Style
    // inline garante o repaint sem depender dessa invalidação. getComputedStyle
    // força um recálculo síncrono, então já lê o valor novo sem precisar
    // esperar um frame.
    const styles = getComputedStyle(document.documentElement);
    document.body.style.backgroundColor = styles.getPropertyValue("--c-bg").trim();
    document.body.style.color = styles.getPropertyValue("--c-fg").trim();
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className="text-current hover:text-accent transition-colors"
    >
      {theme === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="4.2" />
          <path strokeLinecap="round" d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  );
}
