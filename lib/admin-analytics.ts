import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripLocale } from "@/lib/analytics-shared";

export type LeadStats = {
  total: number;
  last7Days: number;
  successCount: number;
  failedCount: number;
  byProperty: { title: string; count: number }[];
  recentFailures: { name: string; createdAt: string; errorMessage: string | null }[];
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function getLeadStats(): Promise<LeadStats> {
  const supabase = createAdminClient();
  const { data: leads, error } = await supabase
    .from("leads")
    .select("name, status, error_message, created_at, property_id, properties(title)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  const rows = leads ?? [];

  const sevenDaysAgo = Date.now() - SEVEN_DAYS_MS;
  const byPropertyMap = new Map<string, number>();
  for (const row of rows) {
    const title = (row.properties as unknown as { title: string } | null)?.title ?? "Sem imóvel associado";
    byPropertyMap.set(title, (byPropertyMap.get(title) ?? 0) + 1);
  }

  return {
    total: rows.length,
    last7Days: rows.filter((r) => new Date(r.created_at).getTime() >= sevenDaysAgo).length,
    successCount: rows.filter((r) => r.status === "success").length,
    failedCount: rows.filter((r) => r.status === "failed").length,
    byProperty: Array.from(byPropertyMap.entries())
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count),
    recentFailures: rows
      .filter((r) => r.status === "failed")
      .slice(0, 10)
      .map((r) => ({ name: r.name, createdAt: r.created_at, errorMessage: r.error_message })),
  };
}

async function getEventCount(type: string): Promise<{ total: number; last7Days: number }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("events").select("created_at").eq("type", type);

  if (error) throw error;
  const rows = data ?? [];
  const sevenDaysAgo = Date.now() - SEVEN_DAYS_MS;
  return {
    total: rows.length,
    last7Days: rows.filter((r) => new Date(r.created_at).getTime() >= sevenDaysAgo).length,
  };
}

export async function getWhatsAppClickCount(): Promise<{ total: number; last7Days: number }> {
  return getEventCount("whatsapp_click");
}

export type EngagementStats = {
  floorplanViews: { total: number; last7Days: number };
  mapViews: { total: number; last7Days: number };
  galleryViews: { total: number; last7Days: number };
};

export async function getEngagementStats(): Promise<EngagementStats> {
  const [floorplanViews, mapViews, galleryViews] = await Promise.all([
    getEventCount("floorplan_view"),
    getEventCount("map_view"),
    getEventCount("gallery_view"),
  ]);
  return { floorplanViews, mapViews, galleryViews };
}

// ---------------------------------------------------------------------------------------------
// Tráfego e engajamento da campanha (Admin → Analytics). Lê os eventos page_view, link_click e
// pdf_download (events.meta) e os leads com origem (leads.attribution).
// ---------------------------------------------------------------------------------------------

const TIME_ZONE = "Europe/Lisbon";
const MAX_ROWS = 30000;
const PAGE_SIZE = 1000;

// Janela em que visitas DIRETAS ao /verdelago6 podem ter vindo do e-mail (lotes de 19, 20 e 21/10
// às 07h30 UTC, com tempo de sobra para quem abre depois). Só aparece separado, sem inventar origem.
const EMAIL_WINDOW_START = Date.parse("2026-10-19T07:30:00Z");
const EMAIL_WINDOW_END = Date.parse("2026-10-24T00:00:00Z");
export const DEFAULT_CAMPAIGN = "verdelago-fase-6";

export type TrafficFilter = {
  campaign: string; // vazio = todas as origens
  from: Date;
  to: Date;
};

export type TrafficStats = {
  visits: number;
  visitsByDay: { day: string; count: number }[];
  byOrigin: { label: string; count: number }[];
  topPages: { path: string; count: number }[];
  linkClicks: { link: string; count: number }[];
  pdf: { pt: number; en: number; other: number; total: number };
  leads: number;
  conversionRate: number | null;
  likelyEmailVisits: number | null;
  campaigns: string[];
  rowsCapped: boolean;
};

type EventRow = { created_at: string; type: string; meta: Record<string, string> | null };

function dayKey(iso: string): string {
  // YYYY-MM-DD no fuso de Lisboa ("sv-SE" formata assim).
  return new Date(iso).toLocaleDateString("sv-SE", { timeZone: TIME_ZONE });
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function sorted(map: Map<string, number>): [string, number][] {
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

async function fetchEvents(filter: TrafficFilter): Promise<{ rows: EventRow[]; capped: boolean }> {
  const supabase = createAdminClient();
  const rows: EventRow[] = [];
  for (let offset = 0; offset < MAX_ROWS; offset += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("events")
      .select("created_at, type, meta")
      .in("type", ["page_view", "link_click", "pdf_download"])
      .gte("created_at", filter.from.toISOString())
      .lte("created_at", filter.to.toISOString())
      .order("created_at", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);
    if (error) throw error;
    rows.push(...((data ?? []) as EventRow[]));
    if (!data || data.length < PAGE_SIZE) return { rows, capped: false };
  }
  return { rows, capped: true };
}

function originLabel(meta: Record<string, string>): string {
  if (meta.utm_source === "email") return "E-mail";
  if (meta.utm_source) return `Outra origem (${meta.utm_source})`;
  if (meta.ref) return `Referência (${meta.ref})`;
  return "Direto";
}

export async function getTrafficStats(filter: TrafficFilter): Promise<TrafficStats> {
  const { rows, capped } = await fetchEvents(filter);
  const campaign = filter.campaign;

  const campaigns = new Set<string>([DEFAULT_CAMPAIGN]);
  for (const row of rows) if (row.meta?.utm_campaign) campaigns.add(row.meta.utm_campaign);

  // Com campanha escolhida, só valem visitas e cliques com essa campanha na origem da sessão.
  const matches = (row: EventRow) => !campaign || row.meta?.utm_campaign === campaign;

  const byDay = new Map<string, number>();
  const byOrigin = new Map<string, number>();
  const pages = new Map<string, number>();
  const clicks = new Map<string, number>();
  const pdf = { pt: 0, en: 0, other: 0, total: 0 };
  let visits = 0;
  let likelyEmail = 0;

  for (const row of rows) {
    const meta = row.meta ?? {};
    if (row.type === "page_view") {
      // Visitas diretas ao /verdelago6 na janela do e-mail: contadas à parte, sem atribuir.
      const at = Date.parse(row.created_at);
      if (meta.path === "/verdelago6" && !meta.utm_source && !meta.ref && at >= EMAIL_WINDOW_START && at < EMAIL_WINDOW_END) {
        likelyEmail += 1;
      }
      if (!matches(row)) continue;
      visits += 1;
      increment(byDay, dayKey(row.created_at));
      increment(byOrigin, originLabel(meta));
      increment(pages, stripLocale(meta.path ?? "/"));
    } else if (row.type === "link_click") {
      if (!matches(row)) continue;
      increment(clicks, meta.link ?? "(sem nome)");
    } else if (row.type === "pdf_download") {
      // Download do PDF não carrega origem (o link do e-mail é direto): vale o período inteiro.
      const file = (meta.link ?? "").toLowerCase();
      pdf.total += 1;
      if (/-pt\.pdf$|documento-comercial-pt|brochura-pt/.test(file)) pdf.pt += 1;
      else if (/-en\.pdf$|commercial-document-en|brochure-en/.test(file)) pdf.en += 1;
      else pdf.other += 1;
    }
  }

  // Leads do período, com a origem gravada (leads.attribution).
  const supabase = createAdminClient();
  const { data: leadRows, error: leadError } = await supabase
    .from("leads")
    .select("created_at, attribution")
    .gte("created_at", filter.from.toISOString())
    .lte("created_at", filter.to.toISOString());
  if (leadError) throw leadError;
  const leadList = (leadRows ?? []) as { created_at: string; attribution: Record<string, string> | null }[];
  const leads = campaign ? leadList.filter((lead) => lead.attribution?.utm_campaign === campaign).length : leadList.length;

  return {
    visits,
    visitsByDay: Array.from(byDay.entries())
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => a.day.localeCompare(b.day)),
    byOrigin: sorted(byOrigin).map(([label, count]) => ({ label, count })),
    topPages: sorted(pages).slice(0, 10).map(([path, count]) => ({ path, count })),
    linkClicks: sorted(clicks).map(([link, count]) => ({ link, count })),
    pdf,
    leads,
    conversionRate: visits > 0 ? Math.round((leads / visits) * 1000) / 10 : null,
    likelyEmailVisits: likelyEmail > 0 ? likelyEmail : null,
    campaigns: Array.from(campaigns).sort(),
    rowsCapped: capped,
  };
}
