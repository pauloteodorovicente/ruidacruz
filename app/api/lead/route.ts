import { NextResponse } from "next/server";

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

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

  if (!name || !phone) {
    return NextResponse.json({ error: "name and phone are required" }, { status: 400 });
  }

  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ") || undefined;

  const headers = {
    Authorization: `Bearer ${token}`,
    Version: GHL_VERSION,
    "Content-Type": "application/json",
  };

  try {
    const contactRes = await fetchWithRetry(`${GHL_BASE}/contacts/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        phone,
        tags: ["site-leca-do-balio"],
        source: "Site - Landing Leça do Balio",
        customFields: [
          { id: FIELD_IMOVEIS_DE_INTERESSE, field_value: ["Moradia T5 | Leça do Balio | Matosinhos"] },
          { id: FIELD_ZONAS, field_value: "Grande Porto" },
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
      return NextResponse.json({ error: "ghl_contact_failed" }, { status: 502 });
    }

    const contactId = contactData?.contact?.id;

    if (contactId && message) {
      await fetchWithRetry(`${GHL_BASE}/contacts/${contactId}/notes`, {
        method: "POST",
        headers,
        body: JSON.stringify({ body: `Mensagem do formulário (Leça do Balio): ${message}` }),
      }).catch((err) => console.error("GHL note error", { message: String(err), timestamp: new Date().toISOString() }));
    }

    return NextResponse.json({ ok: true, contactId });
  } catch (err) {
    console.error("GHL request error", {
      message: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
