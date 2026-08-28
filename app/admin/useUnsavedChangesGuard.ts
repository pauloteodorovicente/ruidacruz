"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Pedido do Paulo (24/08): avisar antes de sair do admin com alterações não
// guardadas, num popup elegante próprio (não o alerta feio do navegador) —
// exceto no caso de fechar a aba/atualizar/digitar outra URL, onde o próprio
// navegador só permite o diálogo nativo dele por segurança (nenhum site pode
// desenhar UI customizada nesse caso específico — é assim em todo navegador).
//
// Uso: const guard = useUnsavedChangesGuard(); <form onChange={guard.markDirty}
// onSubmit={guard.markSubmitting}> ... </form> — depois renderizar
// <UnsavedChangesModal .../> (ver componente irmão) passando o estado do guard.
export function useUnsavedChangesGuard() {
  const [isDirty, setIsDirty] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  const markDirty = useCallback(() => setIsDirty(true), []);
  const markSubmitting = useCallback(() => {
    isSubmittingRef.current = true;
  }, []);

  // Aba fechando/recarregando/URL digitada na barra — só o diálogo nativo do
  // navegador é permitido aqui.
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (!isDirty || isSubmittingRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  // Clique em qualquer link dentro do admin (menu lateral, "Ver Site", etc.)
  // — intercepta antes do Next.js navegar, mostra o popup próprio.
  useEffect(() => {
    function onClickCapture(e: MouseEvent) {
      if (!isDirty || isSubmittingRef.current) return;
      const anchor = (e.target as HTMLElement)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      // Só intercepta navegação normal (sem Ctrl/Cmd/nova aba) dentro do mesmo site.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (anchor.target === "_blank") return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      e.preventDefault();
      e.stopPropagation();
      setPendingHref(anchor.href);
    }
    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [isDirty]);

  function confirmLeave() {
    const href = pendingHref;
    setPendingHref(null);
    setIsDirty(false);
    if (href) window.location.href = href;
  }

  function cancelLeave() {
    setPendingHref(null);
  }

  return { isDirty, pendingHref, markDirty, markSubmitting, confirmLeave, cancelLeave };
}
