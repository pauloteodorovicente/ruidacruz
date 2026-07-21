"use client";

import { useState, type FormEvent } from "react";

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
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
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
