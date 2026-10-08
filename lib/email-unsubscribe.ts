import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getGhlSettings } from "@/lib/settings";

// Link de "cancelar subscrição" dos e-mails do Rui: /api/unsubscribe?e=<e-mail
// em base64url>&s=<assinatura>. A assinatura (HMAC com a chave do servidor)
// impede que alguém cancele o e-mail de outra pessoa só adivinhando o endereço.
// Os scripts de envio (scripts/send_verdelago_fase6_email.js) montam o mesmo
// link com a mesma fórmula — se mudar aqui, mudar lá.
const BASE_URL = "https://ruidacruzconsultor.com";

function secret(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY ausente — não dá pra assinar o link de descadastro.");
  return key;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isPlausibleEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function signEmail(email: string): string {
  return createHmac("sha256", secret()).update(`unsub:${normalizeEmail(email)}`).digest("base64url").slice(0, 32);
}

export function verifySignature(email: string, signature: string): boolean {
  const expected = Buffer.from(signEmail(email));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function buildUnsubscribeUrl(email: string): string {
  const e = Buffer.from(normalizeEmail(email)).toString("base64url");
  return `${BASE_URL}/api/unsubscribe?e=${e}&s=${signEmail(email)}`;
}

export function decodeEmailParam(param: string): string | null {
  try {
    const email = normalizeEmail(Buffer.from(param, "base64url").toString("utf8"));
    return isPlausibleEmail(email) ? email : null;
  } catch {
    return null;
  }
}

// Grava na lista de supressão e, se esse e-mail já for contato no GHL, marca
// "não enviar e-mail" lá também (campanhas feitas dentro do GHL passam a pular
// a pessoa). A parte do GHL é "melhor esforço": se falhar, o cancelamento já
// valeu no nosso lado e é só registado no log.
export async function recordUnsubscribe(email: string, source: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("email_unsubscribes")
    .upsert({ email, source }, { onConflict: "email", ignoreDuplicates: true });
  if (error) throw new Error(error.message);

  try {
    const ghl = await getGhlSettings();
    if (!ghl) return;
    const headers = { Authorization: `Bearer ${ghl.apiToken}`, Version: "2021-07-28", "Content-Type": "application/json" };
    const search = await fetch(
      `https://services.leadconnectorhq.com/contacts/?locationId=${ghl.locationId}&query=${encodeURIComponent(email)}&limit=5`,
      { headers },
    );
    if (!search.ok) return;
    const { contacts } = (await search.json()) as { contacts?: { id: string; email?: string }[] };
    const contact = (contacts ?? []).find((c) => (c.email ?? "").toLowerCase() === email);
    if (!contact) return;
    await fetch(`https://services.leadconnectorhq.com/contacts/${contact.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ dndSettings: { Email: { status: "active", message: "Cancelou a subscrição pelo link do e-mail" } } }),
    });
  } catch (err) {
    console.error("unsubscribe: falha ao marcar DND no GHL", { message: String(err) });
  }
}
