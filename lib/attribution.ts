"use client";

import { sanitizeAttribution, isBotUserAgent, type Attribution } from "@/lib/analytics-shared";

// Origem da visita, guardada só na ABA (sessionStorage): some quando a aba fecha. Nada é gravado
// em cookie nem em armazenamento permanente. A origem vale a da primeira página da sessão
// (utm da URL de chegada ou, sem utm, o domínio de quem enviou o visitante).
const ATTRIBUTION_KEY = "rdc-attr";

// Flag do próprio Paulo/Rui (ligada sozinha ao abrir o admin, ou à mão em Admin → Analytics):
// as visitas deste navegador não contam.
export const INTERNAL_VISITOR_KEY = "rdc-no-track";

export function isInternalVisitor(): boolean {
  try {
    return localStorage.getItem(INTERNAL_VISITOR_KEY) === "1";
  } catch {
    return false;
  }
}

// Visita que não deve ser contada: robô, navegador automatizado ou visitante interno.
export function shouldSkipTracking(): boolean {
  if (typeof navigator === "undefined") return true;
  if (navigator.webdriver) return true;
  if (isBotUserAgent(navigator.userAgent)) return true;
  return isInternalVisitor();
}

function referrerDomain(): string | null {
  try {
    if (!document.referrer) return null;
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    return host === window.location.hostname.replace(/^www\./, "") ? null : host;
  } catch {
    return null;
  }
}

function fromUrl(): Attribution {
  const params = new URLSearchParams(window.location.search);
  return {
    ...(params.get("utm_source") && { utm_source: params.get("utm_source")! }),
    ...(params.get("utm_medium") && { utm_medium: params.get("utm_medium")! }),
    ...(params.get("utm_campaign") && { utm_campaign: params.get("utm_campaign")! }),
  };
}

// Lê a origem guardada na aba; na primeira chamada da sessão, calcula e guarda.
export function getAttribution(): Attribution {
  try {
    const stored = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (stored !== null) return sanitizeAttribution(JSON.parse(stored)) ?? {};
    const ref = referrerDomain();
    const attribution = sanitizeAttribution({ ...fromUrl(), ...(ref && { ref }) }) ?? {};
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return fromUrl();
  }
}
