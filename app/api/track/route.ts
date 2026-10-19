import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TRACKED_EVENT_TYPES, isBotUserAgent, sanitizeMeta } from "@/lib/analytics-shared";
import { isRateLimited } from "@/lib/rate-limit";

// Endpoint genérico de eventos (Fase 6 — base do dashboard de analytics; em 18/10/2026 passou a
// receber também visitas e cliques da campanha Verdelago Fase 6). Sem cookies e sem dados
// pessoais: o IP só serve para limitar abuso, fica na memória por um minuto e nunca é gravado;
// o user-agent só decide se é um robô e também não é gravado.
// Nunca falha de um jeito que afete quem está navegando: erro aqui é só log.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const type = typeof body?.type === "string" ? body.type : "";
  const propertyReference = typeof body?.propertyReference === "string" ? body.propertyReference.slice(0, 80) : "";

  if (!(TRACKED_EVENT_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Robôs e verificadores de link: respondem ok e não gravam nada.
  if (isBotUserAgent(req.headers.get("user-agent"))) return NextResponse.json({ ok: true });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (isRateLimited(`track:${ip}`, 60)) return NextResponse.json({ ok: false }, { status: 429 });

  try {
    const supabase = await createClient();
    let propertyId: string | null = null;
    if (propertyReference) {
      const { data } = await supabase.from("properties").select("id").eq("reference", propertyReference).maybeSingle();
      propertyId = data?.id ?? null;
    }
    await supabase.from("events").insert({ type, property_id: propertyId, meta: sanitizeMeta(body?.meta) });
  } catch (err) {
    console.error("track event error", { message: String(err) });
  }

  return NextResponse.json({ ok: true });
}
