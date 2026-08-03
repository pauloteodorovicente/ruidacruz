"use client";

import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

type SelectProps = {
  name?: string;
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const DEFAULT_BUTTON_CLASS =
  "w-full flex items-center justify-between gap-2 bg-transparent border border-border px-3 py-2.5 text-sm text-left focus:border-accent outline-none transition-colors";

// Select customizado — troca o <select> nativo (feio e sem contraste em
// alguns browsers) por um dropdown com blur e cores do próprio tema.
// Mantém um input hidden com o name pra continuar funcionando em forms
// nativos (server actions), igual um <select> normal.
export function Select({ name, options, value, defaultValue, onChange, placeholder, className }: SelectProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = isControlled ? value : internal;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function select(v: string) {
    setOpen(false);
    if (!isControlled) setInternal(v);
    onChange?.(v);
  }

  const currentOption = options.find((o) => o.value === current);

  return (
    <div ref={ref} className="relative">
      {name && <input type="hidden" name={name} value={current} />}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={className ?? DEFAULT_BUTTON_CLASS}
      >
        <span className={currentOption ? "" : "text-foreground-muted"}>
          {currentOption?.label ?? placeholder ?? "Selecionar"}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          className={`shrink-0 opacity-60 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-30 mt-1.5 max-h-64 overflow-y-auto rounded-md border border-border bg-background-raised/90 backdrop-blur-md shadow-xl">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => select(o.value)}
              className={`block w-full text-left px-3.5 py-2.5 text-sm transition-colors hover:bg-accent/10 ${
                o.value === current ? "text-accent" : "text-foreground"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
