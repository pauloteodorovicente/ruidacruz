"use client";

// Mesmo mecanismo usado pro clique do WhatsApp — Fase 6, etapa Engajamento.
// Nunca bloqueia a navegação/ação real se a rede falhar.
export function trackEvent(type: string, propertyReference?: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, propertyReference }),
    keepalive: true,
  }).catch(() => {});
}
