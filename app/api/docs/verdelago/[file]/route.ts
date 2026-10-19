import { createClient } from "@/lib/supabase/server";
import { isBotUserAgent } from "@/lib/analytics-shared";
import { isRateLimited } from "@/lib/rate-limit";

// Download dos PDFs do Verdelago (brochuras e Documentos Comerciais da Fase 6) com contagem.
// O e-mail da campanha liga direto a /docs/verdelago/<arquivo>.pdf, sem utm e sem JavaScript;
// o next.config.ts reescreve essas MESMAS URLs para esta rota, que lê o arquivo de verdade
// (o PDF estático de public/docs/verdelago, buscado com um cabeçalho que pula a reescrita) e
// o devolve igual, então os links já enviados continuam funcionando e a URL não muda.
//
// Conta um download por abertura real: só GET (nunca HEAD), nunca robô nem verificador de
// link, e só o início do arquivo (leitores de PDF pedem o arquivo em pedaços com "Range";
// os pedidos seguintes não contam). O mesmo visitante abrindo o mesmo arquivo de novo em
// 10 minutos conta uma vez. Nada de IP ou user-agent é gravado.
const FILE_PATTERN = /^[A-Za-z0-9._-]+\.pdf$/;
const REPEAT_WINDOW_MS = 10 * 60_000;
const recent = new Map<string, number>();
const PASS_THROUGH_HEADERS = ["content-type", "content-length", "content-range", "accept-ranges", "etag", "last-modified"];

function isFirstChunk(range: string | null): boolean {
  if (!range) return true;
  return /^bytes=0-/.test(range.trim());
}

async function countDownload(file: string, req: Request) {
  if (isBotUserAgent(req.headers.get("user-agent"))) return;
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (isRateLimited(`pdf:${ip}`, 30)) return;

  const now = Date.now();
  const key = `${ip}|${file}`;
  if (recent.size > 5000) for (const [k, at] of recent) if (now - at > REPEAT_WINDOW_MS) recent.delete(k);
  const last = recent.get(key);
  if (last && now - last < REPEAT_WINDOW_MS) return;
  recent.set(key, now);

  try {
    const supabase = await createClient();
    await supabase.from("events").insert({ type: "pdf_download", property_id: null, meta: { link: file, path: `/docs/verdelago/${file}` } });
  } catch (err) {
    console.error("pdf download event error", { message: String(err) });
  }
}

async function serve(req: Request, params: Promise<{ file: string }>, method: "GET" | "HEAD") {
  const { file } = await params;
  if (!FILE_PATTERN.test(file)) return new Response("Not found", { status: 404 });

  const url = new URL(`/docs/verdelago/${file}`, req.url);
  const upstreamHeaders = new Headers({ "x-internal-doc": "1" });
  const range = req.headers.get("range");
  if (range) upstreamHeaders.set("range", range);

  const upstream = await fetch(url, { method, headers: upstreamHeaders, cache: "no-store" });
  if (!upstream.ok && upstream.status !== 206) return new Response("Not found", { status: 404 });

  if (method === "GET" && isFirstChunk(range)) await countDownload(file, req);

  const headers = new Headers();
  for (const name of PASS_THROUGH_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("content-type", "application/pdf");
  headers.set("cache-control", "public, max-age=3600");
  return new Response(method === "HEAD" ? null : upstream.body, { status: upstream.status, headers });
}

export async function GET(req: Request, ctx: { params: Promise<{ file: string }> }) {
  return serve(req, ctx.params, "GET");
}

export async function HEAD(req: Request, ctx: { params: Promise<{ file: string }> }) {
  return serve(req, ctx.params, "HEAD");
}
