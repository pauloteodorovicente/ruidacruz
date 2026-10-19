import "server-only";

// Limite simples de pedidos por chave (por exemplo, o IP), guardado SÓ na memória do servidor:
// nada é gravado em banco e a chave some sozinha. Em hospedagem serverless cada instância tem a
// sua contagem, então isto segura abuso grosseiro e rajadas, não é uma barreira perfeita.
const WINDOW_MS = 60_000;
const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, maxPerMinute: number): boolean {
  const now = Date.now();
  // Limpeza ocasional para o mapa não crescer sem fim.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > maxPerMinute;
}
