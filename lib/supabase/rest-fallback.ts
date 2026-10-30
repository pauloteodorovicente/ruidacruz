import { Pool } from "pg";

// Ponte de emergência: quando a API REST da Supabase responde 402 (projeto
// restrito por estourar a cota de tráfego do plano gratuito, achado em
// 30/10/2026 — o site inteiro caiu com erro 500), este módulo refaz a MESMA
// consulta direto no Postgres, pela conexão do pooler, que a restrição não
// bloqueia. Só entra em ação nesse caso: com a API funcionando, nada muda.
//
// Cobre só o que as páginas públicas usam: leitura (select com colunas simples,
// eq/neq/gt/gte/lt/lte/like/ilike/is/in/cs, not.*, order, limit, offset,
// objeto único) e inserção simples (leads/eventos). Qualquer coisa fora disso
// (embed, or/and, rpc, update/delete/upsert) devolve a resposta original e o
// erro aparece como antes. As regras de acesso (RLS) valem: a consulta roda com
// o papel do token (anon ou service_role), igual à API.
//
// Desempenho: cada consulta vai num único pedido ao banco (transação + papel +
// consulta juntos) e as leituras ficam 60 s em memória por instância — o mesmo
// ritmo de atualização que os settings públicos já tinham.
//
// Fotos e vídeos guardados no Storage da Supabase continuam bloqueados até a
// cota voltar — o que a ponte devolve são os dados (textos, preços, imóveis).

const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;
const RESERVED = new Set(["select", "order", "limit", "offset", "on_conflict", "columns"]);
const REST_DOWN_MS = 60_000;
const CACHE_TTL_MS = 60_000;
const CACHE_MAX = 500;

let pool: Pool | null = null;
let restDownUntil = 0;
const cache = new Map<string, { at: number; status: number; body: string }>();

function getPool(): Pool | null {
  const url = process.env.SUPABASE_DB_URL;
  if (!url) return null;
  pool ??= new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    max: 8,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
  });
  return pool;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// Literal de texto do Postgres (a consulta vai num pedido só, sem parâmetros).
function lit(value: string): string {
  const clean = value.replace(/\u0000/g, "");
  const escaped = clean.replace(/'/g, "''");
  return clean.includes("\\") ? ` E'${escaped.replace(/\\/g, "\\\\")}'` : `'${escaped}'`;
}

function roleFromJwt(headers: Headers): "anon" | "service_role" {
  const token = (headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "") || headers.get("apikey") || "";
  // Chaves novas da Supabase não são JWT: o prefixo diz o papel.
  if (token.startsWith("sb_secret_")) return "service_role";
  if (token.startsWith("sb_publishable_")) return "anon";
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8"));
    return payload.role === "service_role" ? "service_role" : "anon";
  } catch {
    return "anon";
  }
}

// "(a,b,"c d")" -> ["a","b","c d"]
function parseList(raw: string): string[] | null {
  if (!raw.startsWith("(") || !raw.endsWith(")")) return null;
  const inner = raw.slice(1, -1);
  if (inner === "") return [];
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (quoted) {
      if (ch === "\\" && i + 1 < inner.length) cur += inner[++i];
      else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

// Vira literal de array do Postgres ({"a","b"}), sem tipo — o banco infere pelo
// tipo da coluna.
function arrayLiteral(items: string[]): string {
  return lit(`{${items.map((s) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",")}}`);
}

function buildSelect(table: string, u: URL): string | null {
  if (!IDENT.test(table)) return null;
  const selectParam = u.searchParams.get("select") ?? "*";
  let cols = "*";
  if (selectParam !== "*") {
    const names = selectParam.split(",").map((c) => c.trim());
    if (!names.every((c) => IDENT.test(c))) return null; // embed, alias, cast: fora do escopo
    cols = names.map((c) => `"${c}"`).join(", ");
  }

  const where: string[] = [];
  for (const [key, value] of u.searchParams.entries()) {
    if (RESERVED.has(key)) continue;
    if (key === "or" || key === "and" || !IDENT.test(key)) return null;
    let rest = value;
    let negate = false;
    if (rest.startsWith("not.")) {
      negate = true;
      rest = rest.slice(4);
    }
    const dot = rest.indexOf(".");
    if (dot < 0) return null;
    const op = rest.slice(0, dot);
    const arg = rest.slice(dot + 1);
    const col = `"${key}"`;
    let expr: string;
    if (op === "is") {
      if (arg === "null") expr = `${col} is null`;
      else if (arg === "true") expr = `${col} is true`;
      else if (arg === "false") expr = `${col} is false`;
      else return null;
    } else if (op === "in") {
      const list = parseList(arg);
      if (!list) return null;
      expr = `${col} = any(${arrayLiteral(list)})`;
    } else {
      const sqlOp = ({ eq: "=", neq: "<>", gt: ">", gte: ">=", lt: "<", lte: "<=", like: "like", ilike: "ilike", cs: "@>" } as Record<string, string>)[op];
      if (!sqlOp) return null;
      expr = `${col} ${sqlOp} ${lit(op === "like" || op === "ilike" ? arg.replace(/\*/g, "%") : arg)}`;
    }
    where.push(negate ? `not (${expr})` : expr);
  }

  let order = "";
  const orderParam = u.searchParams.get("order");
  if (orderParam) {
    const parts: string[] = [];
    for (const item of orderParam.split(",")) {
      const [col, ...mods] = item.split(".");
      if (!IDENT.test(col)) return null;
      let piece = `"${col}"`;
      for (const m of mods) {
        if (m === "asc" || m === "desc") piece += ` ${m}`;
        else if (m === "nullsfirst") piece += " nulls first";
        else if (m === "nullslast") piece += " nulls last";
        else return null;
      }
      parts.push(piece);
    }
    order = ` order by ${parts.join(", ")}`;
  }

  const limit = u.searchParams.get("limit");
  const offset = u.searchParams.get("offset");
  if ((limit && !/^\d+$/.test(limit)) || (offset && !/^\d+$/.test(offset))) return null;

  return (
    `select coalesce(json_agg(_t), '[]'::json) as j from (select ${cols} from "public"."${table}"` +
    `${where.length ? ` where ${where.join(" and ")}` : ""}${order}` +
    `${limit ? ` limit ${limit}` : ""}${offset ? ` offset ${offset}` : ""}) _t`
  );
}

// Roda a consulta no papel do token, tudo num único pedido ao banco
// (begin; set local role; claims; consulta; commit) — cada ida e volta ao
// pooler custa caro vista de uma função da Vercel.
async function runAs(role: "anon" | "service_role", sql: string): Promise<unknown> {
  const p = getPool();
  if (!p) throw new Error("SUPABASE_DB_URL não configurada");
  const claims = lit(JSON.stringify({ role }));
  const client = await p.connect();
  let broken = false;
  try {
    const results = (await client.query(
      `begin; set local role ${role}; select set_config('request.jwt.claims', ${claims}, true); ${sql}; commit;`,
    )) as unknown as { rows: Record<string, unknown>[] }[];
    return results[3]?.rows[0]?.j;
  } catch (err) {
    broken = true;
    await client.query("rollback").catch(() => {});
    throw err;
  } finally {
    client.release(broken ? true : undefined);
  }
}

async function viaPostgres(url: string, init: RequestInit | undefined): Promise<Response | null> {
  if (!getPool()) return null;
  const u = new URL(url);
  const tail = u.pathname.split("/rest/v1/")[1];
  if (!tail || tail.includes("/")) return null; // rpc/... e afins
  const table = decodeURIComponent(tail);
  const method = (init?.method ?? "GET").toUpperCase();
  const headers = new Headers(init?.headers);
  const role = roleFromJwt(headers);

  if (method === "GET" || method === "HEAD") {
    const sql = buildSelect(table, u);
    if (!sql) return null;
    const wantObject = (headers.get("accept") ?? "").includes("application/vnd.pgrst.object+json");
    const key = `${role}|${wantObject ? "o" : "a"}|${url}`;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
      return method === "HEAD" ? new Response(null, { status: 200 }) : jsonResponse(hit.body, hit.status);
    }
    const rows = ((await runAs(role, sql)) ?? []) as unknown[];
    let status = 200;
    let body: string;
    if (wantObject && rows.length !== 1) {
      status = 406;
      body = JSON.stringify({
        code: "PGRST116",
        details: `The result contains ${rows.length} rows`,
        hint: null,
        message: "JSON object requested, multiple (or no) rows returned",
      });
    } else {
      body = JSON.stringify(wantObject ? rows[0] : rows);
    }
    if (cache.size >= CACHE_MAX) cache.clear();
    cache.set(key, { at: Date.now(), status, body });
    return method === "HEAD" ? new Response(null, { status: 200 }) : jsonResponse(body, status);
  }

  if (method === "POST" && !u.searchParams.has("on_conflict") && IDENT.test(table) && typeof init?.body === "string") {
    const prefer = headers.get("prefer") ?? "";
    const wantRows = prefer.includes("return=representation");
    const body = init.body.trim().startsWith("[") ? init.body : `[${init.body}]`;
    // Só as colunas enviadas: as demais ficam com o valor padrão do banco (id, data...).
    let columns: string[];
    try {
      const parsed = JSON.parse(body) as Record<string, unknown>[];
      columns = [...new Set(parsed.flatMap((row) => Object.keys(row)))];
    } catch {
      return null;
    }
    if (columns.length === 0 || !columns.every((c) => IDENT.test(c))) return null;
    const list = columns.map((c) => `"${c}"`).join(", ");
    const source = `select ${list} from json_populate_recordset(null::"public"."${table}", ${lit(body)}::json)`;
    const sql = wantRows
      ? `with ins as (insert into "public"."${table}" (${list}) ${source} returning *) select coalesce(json_agg(ins), '[]'::json) as j from ins`
      : `insert into "public"."${table}" (${list}) ${source}`;
    const result = await runAs(role, sql);
    return wantRows ? jsonResponse(result ?? [], 201) : new Response(null, { status: 201 });
  }

  return null;
}

// Substituto de `fetch` pra usar nos clientes da Supabase e nas leituras diretas
// da API REST. Tenta a API; só se ela responder 402 (ou falhar de rede) refaz
// a consulta no Postgres. Lembra por 1 minuto que a API está fora, pra não
// pagar a espera de cada pedido.
export async function fetchWithFallback(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (!url.includes("/rest/v1/") || !process.env.SUPABASE_DB_URL) return fetch(input, init);

  let original: Response | null = null;
  let networkError: unknown = null;
  if (Date.now() >= restDownUntil) {
    try {
      const res = await fetch(input, init);
      if (res.status !== 402) return res;
      original = res;
      restDownUntil = Date.now() + REST_DOWN_MS;
    } catch (err) {
      networkError = err;
    }
  }

  try {
    const fallback = await viaPostgres(url, init);
    if (fallback) return fallback;
  } catch (err) {
    console.error("rest-fallback: consulta direta no Postgres falhou", String(err));
  }
  if (original) return original;
  if (networkError) throw networkError;
  return jsonResponse({ message: "Serviço de dados indisponível" }, 503);
}
