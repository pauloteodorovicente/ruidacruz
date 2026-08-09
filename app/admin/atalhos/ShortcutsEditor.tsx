"use client";

import { useEffect, useRef, useState } from "react";
import { useAdminShortcuts } from "@/lib/use-admin-shortcuts";
import { formatKeys } from "@/lib/admin-shortcuts";

const CAPTURE_WINDOW_MS = 600;

// Mesma janela de 600ms da paleta de comando (CommandPalette.tsx) pra
// decidir se é um atalho de 1 ou 2 teclas — captura o que a pessoa digitar
// e, se uma segunda tecla não vier a tempo, fecha com só a primeira.
export function ShortcutsEditor() {
  const { shortcuts, setActionKeys, resetActionKeys } = useAdminShortcuts();
  const [capturingId, setCapturingId] = useState<string | null>(null);
  const [capturedKeys, setCapturedKeys] = useState<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!capturingId) return;

    function finish(keys: string[]) {
      if (keys.length > 0) setActionKeys(capturingId!, keys);
      setCapturingId(null);
      setCapturedKeys([]);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setCapturingId(null);
        setCapturedKeys([]);
        return;
      }
      const key = e.key.toLowerCase();
      if (key.length !== 1 || !/[a-z]/.test(key)) return;
      e.preventDefault();

      setCapturedKeys((current) => {
        const next = current.length === 0 ? [key] : [current[0], key];
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => finish(next), CAPTURE_WINDOW_MS);
        return next;
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturingId]);

  return (
    <div className="border border-border">
      {shortcuts.map((action) => (
        <div
          key={action.id}
          className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 last:border-b-0"
        >
          <p className="text-sm">{action.label}</p>
          <div className="flex items-center gap-3">
            <span className="min-w-[64px] text-center text-[11px] tracking-[0.08em] uppercase text-accent border border-accent/40 px-2 py-1">
              {capturingId === action.id
                ? capturedKeys.length > 0
                  ? formatKeys(capturedKeys)
                  : "Prima…"
                : formatKeys(action.keys)}
            </span>
            {capturingId === action.id ? (
              <button
                type="button"
                onClick={() => {
                  setCapturingId(null);
                  setCapturedKeys([]);
                }}
                className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors"
              >
                Cancelar
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setCapturingId(action.id);
                    setCapturedKeys([]);
                  }}
                  className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => resetActionKeys(action.id)}
                  className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors"
                >
                  Restaurar
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
