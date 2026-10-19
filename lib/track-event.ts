"use client";

import { stripLocale, type EventMeta, type TrackedEventType } from "@/lib/analytics-shared";
import { getAttribution, shouldSkipTracking } from "@/lib/attribution";

// Registro de eventos (cliques, aberturas de galeria, visitas). Nunca bloqueia a navegação/ação
// real se a rede falhar, e não conta robôs, navegadores automatizados nem o próprio Paulo/Rui
// (ver lib/attribution.ts). `meta` aceita só os campos de lib/analytics-shared.ts.
export function trackEvent(type: TrackedEventType | string, propertyReference?: string, meta?: EventMeta) {
  if (shouldSkipTracking()) return;
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, propertyReference, meta }),
    keepalive: true,
  }).catch(() => {});
}

// Clique em link/botão que importa para a campanha (brochura, tabela, WhatsApp, formulário):
// guarda qual foi (`link`) e em que página. A origem do visitante vai junto.
export function trackLinkClick(link: string, propertyReference?: string) {
  trackEvent("link_click", propertyReference, {
    link,
    // Sem o prefixo de idioma: /pt-BR/verdelago6 e /verdelago6 são a mesma página nas estatísticas.
    path: stripLocale(window.location.pathname),
    ...getAttribution(),
  });
}
