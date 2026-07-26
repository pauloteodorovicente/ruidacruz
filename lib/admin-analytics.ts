import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

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
