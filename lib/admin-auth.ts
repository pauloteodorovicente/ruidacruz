import { createHash } from "crypto";
import { cookies } from "next/headers";

// Gate temporário do /admin (Fase 6) — senha única combinada com o Paulo
// (26/07), sem Supabase Auth ainda ("por ora 1234, troco depois"). O valor do
// cookie é um hash, não a senha em texto puro, só pra não ficar óbvio demais
// no devtools — não é uma sessão real (não expira, não é por usuário).
export const ADMIN_COOKIE_NAME = "admin_auth";

function expectedToken(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD não configurada.");
  return createHash("sha256").update(`admin-session:${password}`).digest("hex");
}

export function checkAdminPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}

export function adminCookieValue(): string {
  return expectedToken();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return !!value && value === expectedToken();
}
