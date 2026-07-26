import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Endpoint genérico de eventos (Fase 6 — base do dashboard de analytics).
// Nunca falha de um jeito que afete quem está navegando: erro aqui é só log.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const type = typeof body?.type === "string" ? body.type : "";
  const propertyReference = typeof body?.propertyReference === "string" ? body.propertyReference : "";

  if (!type) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const supabase = await createClient();
    let propertyId: string | null = null;
    if (propertyReference) {
      const { data } = await supabase.from("properties").select("id").eq("reference", propertyReference).maybeSingle();
      propertyId = data?.id ?? null;
    }
    await supabase.from("events").insert({ type, property_id: propertyId, meta: {} });
  } catch (err) {
    console.error("track event error", { message: String(err) });
  }

  return NextResponse.json({ ok: true });
}
