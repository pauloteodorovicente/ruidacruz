"use client";

import { useState, useTransition } from "react";
import { Select } from "@/app/components/Select";
import { HERO_CTA_DEFAULTS, HERO_LINK_PRESETS, isValidHeroHref } from "@/lib/home-hero-types";
import type { HeroCtaSettings } from "@/lib/home-hero-types";

const labelClass = "block text-[11px] tracking-[0.1em] uppercase text-foreground-muted mb-1.5";
const inputClass =
  "w-full bg-transparent border border-border px-3 py-2.5 text-sm placeholder:text-foreground-muted focus:border-accent outline-none transition-colors";
const CUSTOM = "__custom__";

// Um dos 2 botões: dropdown com destinos prontos + "Outro endereço" (campo
// livre). Se o valor guardado não for nenhum dos prontos, já abre em "Outro".
function LinkPicker({
  title,
  hint,
  value,
  onChange,
}: {
  title: string;
  hint: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const isPreset = HERO_LINK_PRESETS.some((p) => p.value === value);
  const [custom, setCustom] = useState(!isPreset);
  const selected = custom ? CUSTOM : value;

  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className={labelClass}>{title}</span>
        <p className="text-xs text-foreground-muted -mt-0.5 mb-2">{hint}</p>
      </div>
      <Select
        value={selected}
        options={[...HERO_LINK_PRESETS, { value: CUSTOM, label: "Outro endereço…" }]}
        onChange={(next) => {
          if (next === CUSTOM) {
            setCustom(true);
            // Começa o campo livre com o que já estava, em vez de vazio.
            return;
          }
          setCustom(false);
          onChange(next);
        }}
      />
      {custom && (
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/contacto   ou   https://wa.me/351…"
            className={inputClass}
          />
          <p className="text-xs text-foreground-muted mt-1.5">
            Caminho do site (começa com /), link https://, mailto: ou tel:.
          </p>
        </div>
      )}
    </div>
  );
}

export function HeroButtonsForm({
  initial,
  onSave,
}: {
  initial: HeroCtaSettings;
  onSave: (settings: HeroCtaSettings) => Promise<{ ok: true } | { ok: false; error: string }>;
}) {
  const [primary, setPrimary] = useState(initial.primary);
  const [secondary, setSecondary] = useState(initial.secondary);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // O que já está guardado de verdade — o botão "Guardar" só liga quando
  // algo difere disso (e desliga de novo logo depois de guardar).
  const [baseline, setBaseline] = useState(initial);

  const valid = isValidHeroHref(primary) && isValidHeroHref(secondary);
  const unchanged = primary.trim() === baseline.primary && secondary.trim() === baseline.secondary;

  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await onSave({ primary, secondary });
      if (result.ok) {
        setBaseline({ primary: primary.trim(), secondary: secondary.trim() });
        setSaved(true);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-5 border border-border p-6 mt-12">
      <div>
        <h2 className="font-display text-lg text-accent">Botões abaixo do Hero</h2>
        <p className="text-sm text-foreground-muted mt-1">
          Escolha pra onde cada botão leva. O texto do botão continua o mesmo, traduzido nos 7 idiomas.
        </p>
      </div>

      <LinkPicker
        title="Botão 1 — “Portfólio”"
        hint="O botão com contorno, à esquerda."
        value={primary}
        onChange={(v) => {
          setPrimary(v);
          setSaved(false);
        }}
      />
      <LinkPicker
        title="Botão 2 — “Falar com Rui”"
        hint="O botão só com texto, à direita."
        value={secondary}
        onChange={(v) => {
          setSecondary(v);
          setSaved(false);
        }}
      />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || !valid || unchanged}
          className="px-6 py-2.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong disabled:opacity-50"
        >
          {isPending ? "A guardar..." : "Guardar botões"}
        </button>
        <button
          type="button"
          onClick={() => {
            setPrimary(HERO_CTA_DEFAULTS.primary);
            setSecondary(HERO_CTA_DEFAULTS.secondary);
            setSaved(false);
          }}
          className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors"
        >
          Voltar ao padrão
        </button>
        {saved && <span className="text-sm text-accent">Guardado ✓ (aparece no site em até 1 minuto)</span>}
        {!valid && <span className="text-sm" style={{ color: "#a13f3f" }}>Endereço inválido.</span>}
      </div>
      {error && <p className="text-sm" style={{ color: "#a13f3f" }}>{error}</p>}
    </div>
  );
}
