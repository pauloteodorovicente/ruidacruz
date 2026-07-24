"use client";

import { useState, type FormEvent } from "react";
import { parsePhoneNumber, type CountryCode } from "libphonenumber-js";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export type LeadFormStatus = "idle" | "submitting" | "success" | "error";

// Uma nova tentativa se a primeira falhar (rede instável do visitante, blip
// momentâneo) antes de mostrar erro pra quem está a preencher o formulário.
async function submitWithRetry(payload: object, retries = 1): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok || attempt >= retries) return res;
    } catch (err) {
      if (attempt >= retries) throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, 700));
  }
}

export function useLeadForm() {
  const [status, setStatus] = useState<LeadFormStatus>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const countryCode = String(formData.get("countryCode") ?? "+351");
    const countryIso = String(formData.get("countryIso") ?? "PT") as CountryCode;
    const nationalDigits = String(formData.get("phone") ?? "").replace(/\D/g, "");
    // Usa a mesma lib pra montar o E.164 certo (cobre zero de tronco local e
    // outras particularidades por país); cai pra concatenação simples só se
    // o número não fizer sentido pra libphonenumber por algum motivo.
    let phone = `${countryCode}${nationalDigits}`;
    try {
      const parsed = parsePhoneNumber(nationalDigits, countryIso);
      if (parsed) phone = parsed.number;
    } catch {
      // mantém o fallback
    }
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone,
      message: String(formData.get("message") ?? ""),
    };

    try {
      const res = await submitWithRetry(payload, 1);
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      window.fbq?.("track", "Lead", { content_name: "Moradia Leça do Balio" });
    } catch {
      setStatus("error");
    }
  }

  return { status, handleSubmit };
}
