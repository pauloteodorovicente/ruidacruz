"use client";

import { useEffect } from "react";

// Troca de idioma pelo cliente (ex.: redirecionamento automático das landings)
// recria o <html> e perde o data-theme que o script inicial pôs — sem ele nenhuma
// variável --c-* existe: fundo claro, cursor invisível e faixas de cor errada.
// Reaplica o tema salvo (ou do sistema) sempre que o atributo estiver faltando.
export function ThemeEnsure({ locale }: { locale: string }) {
  useEffect(() => {
    const html = document.documentElement;
    if (html.getAttribute("data-theme")) return;
    let theme: string | null = null;
    try {
      theme = localStorage.getItem("theme");
    } catch {}
    html.setAttribute(
      "data-theme",
      theme === "light" || theme === "dark"
        ? theme
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark",
    );
  }, [locale]);
  return null;
}
