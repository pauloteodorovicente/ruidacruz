import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

// Registro pro dashboard de Conversão/Confiabilidade (Fase 6) — nunca deixa
// essa gravação derrubar a resposta ao visitante; um erro aqui só vira log.
async function recordLead(params: {
  name: string;
  phone: string;
  message: string;
  propertyReference: string;
  ghlContactId?: string;
  status: "success" | "failed";
  errorMessage?: string;
}) {
  try {
    const supabase = await createClient();
    // Sem propertyReference é sempre a landing estática da Leça do Balio hoje
    // (único caso que não manda esse campo) — sem isso, todo o tráfego atual
    // apareceria como "sem imóvel associado" no dashboard.
    const reference = params.propertyReference || "122481641-38";
    const { data } = await supabase.from("properties").select("id").eq("reference", reference).maybeSingle();
    const propertyId = data?.id ?? null;
    await supabase.from("leads").insert({
      name: params.name,
      phone: params.phone,
      message: params.message || null,
      property_id: propertyId,
      source: params.propertyReference ? `site-${params.propertyReference}` : "site-leca-do-balio",
      ghl_contact_id: params.ghlContactId ?? null,
      status: params.status,
      error_message: params.errorMessage ?? null,
    });
  } catch (err) {
    console.error("lead record error", { message: String(err), timestamp: new Date().toISOString() });
  }
}

const FIELD_IMOVEIS_DE_INTERESSE = "WAtJLnU545LLu3YWwi4F";
const FIELD_ZONAS = "Avo84eso9QlaqwFW8IAz";

// Tenta de novo em falhas de rede ou 5xx/429 do GHL (transitórias). Erros 4xx
// (ex.: payload inválido) não se resolvem repetindo, então retorna na hora.
async function fetchWithRetry(url: string, options: RequestInit, retries = 1): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || attempt >= retries || (res.status >= 400 && res.status < 500)) {
        return res;
      }
    } catch (err) {
      if (attempt >= retries) throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
  }
}

export async function POST(req: Request) {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!token || !locationId) {
    return NextResponse.json({ error: "GHL not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const propertyReference = typeof body?.propertyReference === "string" ? body.propertyReference.trim() : "";
  const propertyTitle = typeof body?.propertyTitle === "string" ? body.propertyTitle.trim() : "";
  const zone = typeof body?.zone === "string" ? body.zone.trim() : "";

  if (!name || !phone) {
    return NextResponse.json({ error: "name and phone are required" }, { status: 400 });
  }

  // Sem propertyReference (a landing da Leça do Balio hoje não manda esses
  // campos), cai no comportamento de sempre — não muda nada em produção.
  const tag = propertyReference ? `site-${propertyReference}` : "site-leca-do-balio";
  const interestLabel = propertyReference
    ? `${propertyTitle || "Imóvel"} | ${propertyReference}`
    : "Moradia T5 | Leça do Balio | Matosinhos | 122481641-38";
  const zoneValue = zone || "Grande Porto";
  const source = propertyTitle ? `Site - ${propertyTitle}` : "Site - Landing Leça do Balio";

  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ") || undefined;

  const headers = {
    Authorization: `Bearer ${token}`,
    Version: GHL_VERSION,
    "Content-Type": "application/json",
  };

  try {
    // "upsert" em vez de criar: se o telefone já existe como contacto (ex.: o
    // mesmo lead preenchendo de novo), atualiza em vez de rejeitar como
    // duplicado — a criação simples falha com 400 nesse caso.
    const contactRes = await fetchWithRetry(`${GHL_BASE}/contacts/upsert`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        phone,
        tags: [tag],
        source,
        customFields: [
          { id: FIELD_IMOVEIS_DE_INTERESSE, field_value: [interestLabel] },
          { id: FIELD_ZONAS, field_value: zoneValue },
        ],
      }),
    });

    const contactData = await contactRes.json().catch(() => null);

    if (!contactRes.ok) {
      console.error("GHL contact error", {
        status: contactRes.status,
        body: contactData,
        timestamp: new Date().toISOString(),
      });
      await recordLead({
        name,
        phone,
        message,
        propertyReference,
        status: "failed",
        errorMessage: `GHL ${contactRes.status}: ${JSON.stringify(contactData).slice(0, 300)}`,
      });
      return NextResponse.json({ error: "ghl_contact_failed" }, { status: 502 });
    }

    const contactId = contactData?.contact?.id;

    if (contactId && message) {
      await fetchWithRetry(`${GHL_BASE}/contacts/${contactId}/notes`, {
        method: "POST",
        headers,
        body: JSON.stringify({ body: `Mensagem do formulário (${propertyTitle || "Leça do Balio"}): ${message}` }),
      }).catch((err) => console.error("GHL note error", { message: String(err), timestamp: new Date().toISOString() }));
    }

    await recordLead({ name, phone, message, propertyReference, ghlContactId: contactId, status: "success" });
    return NextResponse.json({ ok: true, contactId });
  } catch (err) {
    console.error("GHL request error", {
      message: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    });
    await recordLead({
      name,
      phone,
      message,
      propertyReference,
      status: "failed",
      errorMessage: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
