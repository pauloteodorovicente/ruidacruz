import { NextResponse } from "next/server";
import {
  decodeEmailParam,
  recordUnsubscribe,
  verifySignature,
} from "@/lib/email-unsubscribe";

// Cancelar subscrição dos e-mails do Rui. GET só mostra a tela de confirmação
// (assim scanners de e-mail que pré-abrem links não cancelam ninguém por
// acidente); quem de fato cancela é o POST do botão "Confirmar".
function page(title: string, bodyHtml: string, status = 200) {
  const html = `<!DOCTYPE html>
<html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>${title} · Rui Da Cruz</title></head>
<body style="margin:0;background:#f4f1ec;font-family:Arial,Helvetica,sans-serif;color:#222;">
<div style="max-width:480px;margin:48px auto;padding:0 16px;">
  <div style="background:#040815;padding:22px;text-align:center;color:#ce946e;font-family:Georgia,serif;letter-spacing:3px;text-transform:uppercase;font-size:13px;">Rui Da Cruz</div>
  <div style="background:#fff;padding:32px 28px;line-height:1.6;font-size:15px;">${bodyHtml}</div>
</div></body></html>`;
  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const invalid = () =>
  page(
    "Link inválido",
    `<h1 style="font-family:Georgia,serif;font-weight:normal;font-size:22px;margin:0 0 12px;">Link inválido</h1>
     <p style="margin:0;">Este link não é válido ou está incompleto. Se quiser deixar de receber os e-mails, responda a uma das mensagens e retiramos o seu endereço.</p>`,
    400,
  );

function parse(e: string | null, s: string | null) {
  if (!e || !s) return null;
  const email = decodeEmailParam(e);
  if (!email || !verifySignature(email, s)) return null;
  return { email, e, s };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = parse(searchParams.get("e"), searchParams.get("s"));
  if (!parsed) return invalid();

  return page(
    "Cancelar subscrição",
    `<h1 style="font-family:Georgia,serif;font-weight:normal;font-size:22px;margin:0 0 12px;">Cancelar subscrição</h1>
     <p style="margin:0 0 20px;">Deixar de receber e-mails do Rui da Cruz em <strong>${escapeHtml(parsed.email)}</strong>?</p>
     <form method="POST" action="/api/unsubscribe">
       <input type="hidden" name="e" value="${escapeHtml(parsed.e)}">
       <input type="hidden" name="s" value="${escapeHtml(parsed.s)}">
       <button type="submit" style="background:#ce946e;color:#040815;border:0;padding:13px 26px;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">Confirmar</button>
     </form>`,
  );
}

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const parsed = parse(String(form?.get("e") ?? ""), String(form?.get("s") ?? ""));
  if (!parsed) return invalid();

  try {
    await recordUnsubscribe(parsed.email, "link-email");
  } catch (err) {
    console.error("unsubscribe error", { message: String(err) });
    return page(
      "Não foi possível cancelar",
      `<p style="margin:0;">Ocorreu um erro ao cancelar a subscrição. Tente novamente dentro de alguns minutos ou responda ao e-mail que recebeu.</p>`,
      500,
    );
  }

  return page(
    "Subscrição cancelada",
    `<h1 style="font-family:Georgia,serif;font-weight:normal;font-size:22px;margin:0 0 12px;">Subscrição cancelada</h1>
     <p style="margin:0;">Pronto. <strong>${escapeHtml(parsed.email)}</strong> não voltará a receber e-mails do Rui da Cruz.</p>`,
  );
}
