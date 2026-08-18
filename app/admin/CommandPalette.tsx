"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminShortcuts } from "@/lib/use-admin-shortcuts";
import { keysEqual } from "@/lib/admin-shortcuts";

const SEQUENCE_WINDOW_MS = 600;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return true;
  return target.isContentEditable;
}

// Cmd/Ctrl+K abre a paleta de busca; fora dela, as teclas configuradas em
// /admin/atalhos navegam direto (sequência tipo "G I" com uma janela curta
// entre as duas teclas — mesmo padrão do GitHub/Linear). Nunca dispara
// enquanto o foco está num campo de texto, senão digitar "novo imóvel" no
// título ativaria o atalho de "N" no meio da digitação.
export function CommandPalette() {
  const router = useRouter();
  const { shortcuts } = useAdminShortcuts();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingKey = useRef<{ key: string; timestamp: number } | null>(null);

  const filtered = shortcuts.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const cmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (cmdK) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (open) return;
      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();
      if (key.length !== 1 || !/[a-z]/.test(key)) return;

      const now = Date.now();
      const pending = pendingKey.current;
      const sequence = pending && now - pending.timestamp < SEQUENCE_WINDOW_MS ? [pending.key, key] : [key];

      const match = shortcuts.find((s) => keysEqual(s.keys, sequence));
      if (match) {
        pendingKey.current = null;
        router.push(match.href);
        return;
      }

      const couldExtend = shortcuts.some((s) => s.keys.length === 2 && s.keys[0] === key);
      pendingKey.current = couldExtend ? { key, timestamp: now } : null;
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, shortcuts, router]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      go(filtered[activeIndex].href);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md border border-border bg-background-raised shadow-2xl"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Ir para…"
          className="w-full bg-transparent px-5 py-4 text-sm outline-none placeholder:text-foreground-muted"
        />
        <ul className="border-t border-border py-2">
          {filtered.length === 0 && <li className="px-5 py-3 text-sm text-foreground-muted">Nada encontrado.</li>}
          {filtered.map((action, i) => (
            <li key={action.id}>
              <button
                type="button"
                onClick={() => go(action.href)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full items-center justify-between px-5 py-2.5 text-left text-sm transition-colors ${
                  i === activeIndex ? "bg-accent/10 text-accent" : "text-foreground"
                }`}
              >
                {action.label}
                <span className="text-[10px] tracking-[0.08em] uppercase text-foreground-muted">
                  {action.keys.map((k) => k.toUpperCase()).join(" ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
