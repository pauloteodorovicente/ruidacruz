"use client";

import { useEffect } from "react";

// app/layout.tsx (raiz) é compartilhado com o /admin, então o <html lang> lá
// fica fixo em "pt-PT" (não dá pra parametrizar por rota sem duplicar o
// layout raiz). Esse componente corrige isso nas páginas roteadas por idioma,
// mas só depois do JavaScript carregar — o HTML que o servidor entrega ainda
// diz pt-PT (pendência registrada pra auditoria da I-5).
export function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
