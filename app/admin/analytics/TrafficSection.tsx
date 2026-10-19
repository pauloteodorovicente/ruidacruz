import { getTrafficStats, DEFAULT_CAMPAIGN, type TrafficFilter } from "@/lib/admin-analytics";
import { InternalVisitorToggle } from "./InternalVisitorToggle";

export type TrafficSearchParams = { campanha?: string; periodo?: string; de?: string; ate?: string };

const PERIODS: { value: string; label: string }[] = [
  { value: "24h", label: "Últimas 24 horas" },
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "campanha", label: "Campanha Fase 6 (19 a 23/10)" },
  { value: "tudo", label: "Desde o início" },
];

const DAY_MS = 24 * 60 * 60 * 1000;

// Período escolhido → intervalo de datas. Datas "de/até" (campos de data) mandam sobre a lista.
export function resolveTrafficFilter(params: TrafficSearchParams): { filter: TrafficFilter; period: string } {
  const now = new Date();
  const campaign = params.campanha ?? DEFAULT_CAMPAIGN;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (params.de && datePattern.test(params.de)) {
    const from = new Date(`${params.de}T00:00:00+01:00`);
    const to = params.ate && datePattern.test(params.ate) ? new Date(`${params.ate}T23:59:59+01:00`) : now;
    return { filter: { campaign, from, to }, period: "datas" };
  }
  const period = PERIODS.some((p) => p.value === params.periodo) ? params.periodo! : "7d";
  const from =
    period === "24h"
      ? new Date(now.getTime() - DAY_MS)
      : period === "30d"
        ? new Date(now.getTime() - 30 * DAY_MS)
        : period === "campanha"
          ? new Date("2026-10-19T00:00:00+01:00")
          : period === "tudo"
            ? new Date("2020-01-01T00:00:00Z")
            : new Date(now.getTime() - 7 * DAY_MS);
  const to = period === "campanha" ? new Date("2026-10-24T00:00:00+01:00") : now;
  return { filter: { campaign, from, to }, period };
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border border-border bg-background-raised p-5">
      <p className="font-display text-3xl text-accent">{value}</p>
      <p className="text-xs tracking-[0.08em] uppercase text-foreground-muted mt-1">{label}</p>
      {hint && <p className="text-xs text-foreground-muted/70 mt-1">{hint}</p>}
    </div>
  );
}

function RankTable({ title, rows, empty }: { title: string; rows: { label: string; count: number }[]; empty: string }) {
  return (
    <div className="border border-border">
      <p className="px-4 py-2 text-[11px] tracking-[0.08em] uppercase text-foreground-muted border-b border-border">{title}</p>
      {rows.length === 0 ? (
        <p className="px-4 py-3 text-sm text-foreground-muted">{empty}</p>
      ) : (
        rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-border last:border-b-0 text-sm">
            <span className="min-w-0 break-words">{row.label}</span>
            <span className="text-foreground-muted tabular-nums">{row.count}</span>
          </div>
        ))
      )}
    </div>
  );
}

const CLICK_LABELS: Record<string, string> = {
  brochura_pt: "Brochura PT",
  brochura_en: "Brochura EN",
  doc_comercial_pt: "Documento comercial PT (Fase 6)",
  doc_comercial_en: "Documento comercial EN (Fase 6)",
  ver_fracoes: "Botão “Ver frações”",
  falar_contacto: "Botão “Falar com o Rui”",
  whatsapp: "WhatsApp",
  enviar_formulario: "Formulário enviado",
};

function clickLabel(link: string): string {
  if (CLICK_LABELS[link]) return CLICK_LABELS[link];
  if (link.startsWith("tabela_")) return `Abriu a tabela: ${link.slice(7).replace(/_/g, " ")}`;
  return link;
}

const inputClass = "bg-background-raised border border-border px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none";

export async function TrafficSection({ params }: { params: TrafficSearchParams }) {
  const { filter, period } = resolveTrafficFilter(params);
  const stats = await getTrafficStats(filter);
  const emailVisits = stats.byOrigin.find((row) => row.label === "E-mail")?.count ?? 0;
  const directVisits = stats.byOrigin.find((row) => row.label === "Direto")?.count ?? 0;
  const maxDay = Math.max(1, ...stats.visitsByDay.map((day) => day.count));

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-lg text-accent">Tráfego e campanha</h2>
        <p className="text-xs text-foreground-muted">
          Visitas contadas sem cookies e sem dados pessoais: só página, idioma e origem. Não contam robôs, o /admin nem
          os navegadores marcados como seus.
        </p>
      </div>

      <form method="get" className="flex flex-wrap items-end gap-3 border border-border p-4">
        <label className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.08em] text-foreground-muted">
          Campanha
          <select name="campanha" defaultValue={filter.campaign} className={inputClass}>
            <option value="">Todas as origens</option>
            {stats.campaigns.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.08em] text-foreground-muted">
          Período
          <select name="periodo" defaultValue={period === "datas" ? "7d" : period} className={inputClass}>
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.08em] text-foreground-muted">
          Ou de
          <input type="date" name="de" defaultValue={params.de ?? ""} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.08em] text-foreground-muted">
          até
          <input type="date" name="ate" defaultValue={params.ate ?? ""} className={inputClass} />
        </label>
        <button
          type="submit"
          className="px-5 py-2.5 bg-accent text-background font-body text-sm tracking-[0.05em] uppercase transition-all hover:bg-accent-strong"
        >
          Filtrar
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Visitas" value={stats.visits} hint={filter.campaign ? `campanha ${filter.campaign}` : "todas as origens"} />
        <StatCard label="Vieram do e-mail" value={emailVisits} hint="utm_source=email" />
        <StatCard label="Acesso direto" value={directVisits} hint="sem origem conhecida" />
        <StatCard
          label="Visita → lead"
          value={stats.conversionRate !== null ? `${stats.conversionRate}%` : "—"}
          hint={`${stats.leads} lead${stats.leads === 1 ? "" : "s"} no período`}
        />
      </div>

      {stats.likelyEmailVisits !== null && (
        <p className="border border-dashed border-border p-4 text-sm text-foreground-muted">
          <span className="text-foreground">{stats.likelyEmailVisits}</span> visita{stats.likelyEmailVisits === 1 ? "" : "s"} direta
          {stats.likelyEmailVisits === 1 ? "" : "s"} ao /verdelago6 entre 19 e 23/10, sem origem registrada. Podem ser do e-mail (o link da
          tabela e as brochuras não levam utm), mas não dá para confirmar, por isso ficam separadas.
        </p>
      )}

      <div className="border border-border">
        <p className="px-4 py-2 text-[11px] tracking-[0.08em] uppercase text-foreground-muted border-b border-border">Visitas por dia</p>
        {stats.visitsByDay.length === 0 ? (
          <p className="px-4 py-3 text-sm text-foreground-muted">Nenhuma visita neste período.</p>
        ) : (
          stats.visitsByDay.map((day) => (
            <div key={day.day} className="flex items-center gap-3 px-4 py-2 border-b border-border last:border-b-0 text-sm">
              <span className="w-24 shrink-0 text-foreground-muted tabular-nums">{day.day.split("-").reverse().join("/")}</span>
              <span className="h-2 bg-accent/70" style={{ width: `${Math.max(2, (day.count / maxDay) * 60)}%` }} />
              <span className="tabular-nums">{day.count}</span>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RankTable title="Visitas por origem" rows={stats.byOrigin} empty="Sem visitas neste período." />
        <RankTable
          title="Páginas mais vistas"
          rows={stats.topPages.map((row) => ({ label: row.path, count: row.count }))}
          empty="Sem visitas neste período."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RankTable
          title="Cliques por link"
          rows={stats.linkClicks.map((row) => ({ label: clickLabel(row.link), count: row.count }))}
          empty="Nenhum clique registrado neste período."
        />
        <div className="grid grid-cols-2 gap-4 content-start">
          <StatCard label="PDF em português" value={stats.pdf.pt} hint="downloads" />
          <StatCard label="PDF em inglês" value={stats.pdf.en} hint="downloads" />
          <p className="col-span-2 text-xs text-foreground-muted">
            Os downloads dos PDFs são contados em todo o período, sem separar por campanha: o link do e-mail é direto e não
            carrega origem.
            {stats.pdf.other > 0 ? ` Outros PDFs: ${stats.pdf.other}.` : ""}
          </p>
        </div>
      </div>

      {stats.rowsCapped && (
        <p className="text-xs text-foreground-muted">Período muito grande: mostrando só os primeiros 30 mil eventos. Escolha um período menor.</p>
      )}

      <InternalVisitorToggle />
    </section>
  );
}
