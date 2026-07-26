import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getLeadStats, getWhatsAppClickCount } from "@/lib/admin-analytics";

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border border-border bg-background-raised p-5">
      <p className="font-display text-3xl text-accent">{value}</p>
      <p className="text-xs tracking-[0.08em] uppercase text-foreground-muted mt-1">{label}</p>
      {hint && <p className="text-xs text-foreground-muted/70 mt-1">{hint}</p>}
    </div>
  );
}

function NotCollectingYet({ what, howTo }: { what: string; howTo: string }) {
  return (
    <div className="border border-dashed border-border p-6 text-center">
      <p className="text-sm text-foreground-muted">Ainda não coletamos {what}.</p>
      <p className="text-xs text-foreground-muted/70 mt-2 max-w-md mx-auto">{howTo}</p>
    </div>
  );
}

export default async function AnalyticsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [leadStats, whatsapp] = await Promise.all([getLeadStats(), getWhatsAppClickCount()]);
  const conversionRate =
    leadStats.total > 0 ? Math.round((leadStats.successCount / leadStats.total) * 100) : null;

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-4xl flex flex-col gap-14">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-1">Painel Administrativo</p>
            <h1 className="font-display text-2xl">Analytics</h1>
          </div>
          <Link href="/admin" className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors">
            ← Imóveis
          </Link>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-lg text-accent">Tráfego</h2>
          <NotCollectingYet
            what="visitantes, sessões, origem, país, idioma ou dispositivo"
            howTo='Precisa de uma ferramenta de análise de visitas (ex.: Google Analytics) ligada ao site — ainda não configurada. É uma decisão rápida de tomar quando fizer sentido.'
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-lg text-accent">Engajamento</h2>
          <NotCollectingYet
            what="reprodução de vídeo, fotos vistas na galeria ou cliques em 'Ver Plantas'/'Ver no mapa'"
            howTo="Dá pra registrar cada um desses cliques (o mecanismo já existe, usado agora só pro WhatsApp) — falta ligar nos outros botões, um output futuro."
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-lg text-accent">Conversão</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Formulários enviados" value={leadStats.total} hint="desde sempre" />
            <StatCard label="Últimos 7 dias" value={leadStats.last7Days} />
            <StatCard label="Taxa de sucesso" value={conversionRate !== null ? `${conversionRate}%` : "—"} hint="chegou ao GHL" />
            <StatCard label="Cliques no WhatsApp" value={whatsapp.total} hint={`${whatsapp.last7Days} nos últimos 7 dias · conversão paralela`} />
          </div>
          {leadStats.byProperty.length > 0 && (
            <div className="border border-border">
              <p className="px-4 py-2 text-[11px] tracking-[0.08em] uppercase text-foreground-muted border-b border-border">
                Por imóvel
              </p>
              {leadStats.byProperty.map((row) => (
                <div key={row.title} className="flex items-center justify-between px-4 py-2.5 border-b border-border last:border-b-0 text-sm">
                  <span>{row.title}</span>
                  <span className="text-foreground-muted">{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-lg text-accent">Confiabilidade</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard label="Envios com falha" value={leadStats.failedCount} />
            <StatCard
              label="Último erro"
              value={leadStats.recentFailures[0] ? new Date(leadStats.recentFailures[0].createdAt).toLocaleDateString("pt-PT") : "Nenhum"}
            />
          </div>
          {leadStats.recentFailures.length > 0 && (
            <details className="border border-border">
              <summary className="px-4 py-2.5 text-sm cursor-pointer select-none">Ver detalhes das falhas recentes</summary>
              <div className="border-t border-border">
                {leadStats.recentFailures.map((f, i) => (
                  <div key={i} className="px-4 py-2.5 border-b border-border last:border-b-0 text-xs">
                    <p className="text-foreground-muted">
                      {new Date(f.createdAt).toLocaleString("pt-PT")} — {f.name}
                    </p>
                    <p className="text-foreground-muted/70 mt-0.5">{f.errorMessage}</p>
                  </div>
                ))}
              </div>
            </details>
          )}
        </section>
      </div>
    </main>
  );
}
