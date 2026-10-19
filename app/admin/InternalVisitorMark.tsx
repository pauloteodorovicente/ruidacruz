"use client";

import { useEffect } from "react";
import { INTERNAL_VISITOR_KEY } from "@/lib/attribution";

// Quem abre o /admin é do time: marca este navegador como visitante interno, e as visitas e cliques
// dele no site público deixam de contar nas estatísticas. Só grava um sinal no próprio navegador
// (localStorage), nada é enviado a lugar nenhum. Dá para desligar em Admin → Analytics.
// A marca só é posta uma vez: se alguém desligar de propósito, não volta sozinha na mesma sessão.
const MARKED_KEY = "rdc-no-track-marked";

export function InternalVisitorMark() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(MARKED_KEY)) return;
      sessionStorage.setItem(MARKED_KEY, "1");
      localStorage.setItem(INTERNAL_VISITOR_KEY, "1");
    } catch {
      // sem armazenamento: nada a fazer
    }
  }, []);
  return null;
}
