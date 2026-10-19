"use client";

import { useEffect, useState } from "react";
import { INTERNAL_VISITOR_KEY } from "@/lib/attribution";

// Modo visitante interno: as visitas e cliques DESTE navegador não contam nas estatísticas. Liga sozinho
// ao abrir qualquer tela do admin (ver InternalVisitorMark); aqui dá para ver o estado e desligar
// (por exemplo, para testar o próprio site como se fosse um visitante) ou ligar de novo.
export function InternalVisitorToggle() {
  const [ignored, setIgnored] = useState<boolean | null>(null);

  useEffect(() => {
    let value = false;
    try {
      value = localStorage.getItem(INTERNAL_VISITOR_KEY) === "1";
    } catch {
      // sem armazenamento: trata como "conta"
    }
    // Leitura do navegador depois da hidratação (não existe no servidor).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIgnored(value);
  }, []);

  function toggle() {
    const next = !ignored;
    try {
      if (next) localStorage.setItem(INTERNAL_VISITOR_KEY, "1");
      else localStorage.removeItem(INTERNAL_VISITOR_KEY);
    } catch {
      // sem armazenamento: não há como lembrar
    }
    setIgnored(next);
  }

  return (
    <div className="flex flex-col gap-2 border border-border p-4 text-sm" data-testid="internal-visitor">
      <p className="text-[11px] uppercase tracking-[0.08em] text-foreground-muted">Suas visitas</p>
      <p>
        {ignored === null
          ? "A verificar…"
          : ignored
            ? "Este navegador NÃO conta nas estatísticas (modo visitante interno ligado)."
            : "Este navegador CONTA nas estatísticas, como um visitante qualquer."}
      </p>
      <button
        type="button"
        onClick={toggle}
        disabled={ignored === null}
        className="self-start px-4 py-2 border border-border text-xs tracking-[0.08em] uppercase hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
      >
        {ignored ? "Voltar a contar as minhas visitas" : "Não contar as minhas visitas"}
      </button>
    </div>
  );
}
