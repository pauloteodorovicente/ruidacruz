"use client";

import { useEffect } from "react";

// app/layout.tsx (raiz) é compartilhado com /leca-do-balio e /admin, então o
// <html lang> lá fica fixo em "pt-PT" (não dá pra parametrizar por rota sem
// duplicar o layout raiz). Esse componente corrige isso especificamente nas
// páginas institucionais roteadas por idioma.
export function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
