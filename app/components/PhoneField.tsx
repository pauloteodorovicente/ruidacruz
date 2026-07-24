"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countryCodes, defaultCountryCode, type CountryCode } from "@/lib/country-codes";
import { extractDigits, applyMask, maskDigitCount, examplePlaceholder } from "@/lib/phone-mask";
import { flagComponents } from "./FlagIcon";

const DIACRITICS = /[̀-ͯ]/g;

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(DIACRITICS, "");
}

const sortedCountries = [...countryCodes].sort((a, b) => a.label.localeCompare(b.label, "pt"));

type PhoneFieldProps = {
  countryAriaLabel: string;
  phonePlaceholderFallback: string;
};

export function PhoneField({ countryAriaLabel, phonePlaceholderFallback }: PhoneFieldProps) {
  const [selected, setSelected] = useState<CountryCode>(
    sortedCountries.find((c) => c.code === defaultCountryCode) ?? sortedCountries[0]
  );
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return sortedCountries;
    const nq = normalize(q);
    const digitsQuery = q.replace(/\D/g, "");
    return sortedCountries.filter((c) => {
      const nameMatch = normalize(c.label).includes(nq);
      const digitMatch = digitsQuery.length > 0 && c.code.replace("+", "").includes(digitsQuery);
      return nameMatch || digitMatch;
    });
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
      if (e.key === "Enter" && filtered.length > 0) {
        e.preventDefault();
        pick(filtered[0]);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    searchRef.current?.focus();
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered]);

  function pick(c: CountryCode) {
    // Reaplica os dígitos já digitados no novo formato do país escolhido.
    const digits = extractDigits(phoneDisplay).slice(0, maskDigitCount(c.mask));
    setPhoneDisplay(applyMask(digits, c.mask));
    setSelected(c);
    setOpen(false);
    setQuery("");
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = extractDigits(e.target.value).slice(0, maskDigitCount(selected.mask));
    setPhoneDisplay(applyMask(digits, selected.mask));
  }

  const SelectedFlag = flagComponents[selected.flagCode];
  const placeholder = selected.mask ? examplePlaceholder(selected.mask) : phonePlaceholderFallback;

  return (
    <div className="flex gap-2">
      <div ref={rootRef} className="relative shrink-0">
        <button
          type="button"
          aria-label={countryAriaLabel}
          onClick={() => setOpen((o) => !o)}
          className="flex h-full items-center gap-1.5 bg-transparent border border-white/20 pl-3 pr-2.5 py-3 text-sm hover:border-white/40 focus-visible:outline-2 focus-visible:outline-[#ce946e] outline-none transition-colors"
        >
          <SelectedFlag className="h-3.5 w-5 shrink-0" />
          <span className="text-white/70">{selected.code}</span>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className={`ml-0.5 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}>
            <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <div className="absolute left-0 top-full z-20 mt-1 w-64 max-w-[80vw] border border-white/20 bg-[#0a1024] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="País ou DDI…"
              className="w-full bg-transparent border-b border-white/20 px-3 py-2.5 text-sm placeholder:text-white/40 outline-none"
            />
            <ul className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 && <li className="px-3 py-2.5 text-sm text-white/40">Nenhum país encontrado</li>}
              {filtered.map((c) => {
                const ItemFlag = flagComponents[c.flagCode];
                return (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => pick(c)}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
                        c.code === selected.code ? "text-[#ce946e]" : "text-white/85"
                      }`}
                    >
                      <ItemFlag className="h-3.5 w-5 shrink-0" />
                      <span className="flex-1">{c.label}</span>
                      <span className="text-white/40 text-xs">{c.code}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <input
        name="phone"
        type="tel"
        inputMode="numeric"
        required
        value={phoneDisplay}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent border border-white/20 px-4 py-3 text-sm placeholder:text-white/40 focus:border-[#ce946e] outline-none transition-colors"
      />
      <input type="hidden" name="countryCode" value={selected.code} />
    </div>
  );
}
