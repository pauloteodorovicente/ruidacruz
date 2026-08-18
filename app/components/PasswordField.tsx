"use client";

import { useId, useState } from "react";

// Campo de senha com olhinho pra revelar o valor — usar em qualquer campo de
// senha/token do site (login do admin, tokens de integração, etc.), nunca um
// <input type="password"> cru.
export function PasswordField({
  value,
  onChange,
  className,
  placeholder,
  autoComplete,
  autoFocus,
  name,
  id,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  className: string;
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  required?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="relative">
      <input
        id={inputId}
        name={name}
        type={revealed ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        required={required}
        className={`${className} pr-10`}
      />
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        aria-label={revealed ? "Ocultar senha" : "Mostrar senha"}
        aria-controls={inputId}
        className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-foreground-muted hover:text-accent transition-colors"
      >
        {revealed ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.6 5.1A10.9 10.9 0 0 1 12 5c5.5 0 9.5 4.5 10.5 7-.4 1-1.1 2.2-2.1 3.3M6.6 6.6C4.5 8 3 10 2.5 12c1 2.5 5 7 9.5 7 1.5 0 2.9-.4 4.1-1.1"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 10a3 3 0 0 0 4.2 4.2" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12c1-2.5 5-7 9.5-7s8.5 4.5 9.5 7c-1 2.5-5 7-9.5 7s-8.5-4.5-9.5-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
