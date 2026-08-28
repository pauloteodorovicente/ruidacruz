"use client";

import { useState, useTransition } from "react";
import { generatePreviewLink } from "./actions";

// Só existe pro modelo genérico de imóvel — as 4 landings de campanha (Leça,
// Verdelago, Portimão, OneGreenway) têm o conteúdo fixo no código, não nesta
// tabela, então o link com token não tem onde ser validado nelas.
export function PreviewLinkButton({ propertyId, propertyReference }: { propertyId: string; propertyReference: string }) {
  const [isPending, startTransition] = useTransition();
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    setCopied(false);
    startTransition(async () => {
      const token = await generatePreviewLink(propertyId, propertyReference);
      setLink(`${window.location.origin}/imoveis/${propertyReference}?preview=${token}`);
    });
  }

  async function handleCopy() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    // Volta pro texto normal depois de um tempo, pra poder copiar de novo
    // sem precisar sair e voltar na tela.
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isPending}
        className="self-start text-xs tracking-[0.08em] uppercase text-accent hover:text-accent-strong transition-colors disabled:opacity-50"
      >
        {isPending ? "A gerar…" : "Gerar link de pré-visualização (48h) →"}
      </button>
      {link && (
        <div className="flex items-center gap-2">
          <input readOnly value={link} className="flex-1 bg-transparent border border-border px-3 py-2 text-xs" />
          <button
            type="button"
            onClick={handleCopy}
            className="text-[11px] tracking-[0.08em] uppercase px-2 py-2 border border-border text-foreground-muted transition-colors hover:text-accent hover:border-accent"
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
      )}
    </div>
  );
}
