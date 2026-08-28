"use client";

// Popup próprio (não o alerta nativo do navegador) pra confirmar saída com
// alterações não guardadas — mesmo padrão translúcido/desfocado já usado no
// resto do admin (ex. o dropdown de Select.tsx).
export function UnsavedChangesModal({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm border border-border bg-background-raised/95 backdrop-blur-md shadow-2xl p-6">
        <h2 className="font-display text-lg text-accent mb-2">Sair sem guardar?</h2>
        <p className="text-sm text-foreground-muted mb-6">
          Você tem alterações que ainda não foram guardadas. Se sair agora, elas se perdem.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs tracking-[0.08em] uppercase border border-accent text-accent hover:bg-accent hover:text-background transition-colors"
          >
            Sair sem guardar
          </button>
        </div>
      </div>
    </div>
  );
}
