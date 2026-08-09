import Link from "next/link";

type MissingCertProperty = { reference: string; title: string };

// "Central do dia" — dois alertas, cada um com sua própria regra de quando
// aparece: leads sempre mostra (mesmo "0", é informação útil sobre o
// período), certificado energético só aparece quando há pelo menos 1 imóvel
// faltando (não é alerta se não tem nada pra agir).
export function AdminSummary({
  leadsLast7Days,
  missingCertificate,
}: {
  leadsLast7Days: number;
  missingCertificate: MissingCertProperty[];
}) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <div className="flex-1 min-w-[220px] border border-border px-5 py-4">
        <p className="text-2xl font-display text-accent">{leadsLast7Days}</p>
        <p className="text-xs text-foreground-muted mt-1">
          {leadsLast7Days === 1 ? "Lead" : "Leads"} nos últimos 7 dias
        </p>
      </div>

      {missingCertificate.length > 0 && (
        <div className="flex-1 min-w-[220px] border border-accent/40 bg-accent/5 px-5 py-4">
          <p className="text-xs tracking-[0.08em] uppercase text-accent mb-2">
            {missingCertificate.length === 1
              ? "1 imóvel sem certificado energético"
              : `${missingCertificate.length} imóveis sem certificado energético`}
          </p>
          <ul className="flex flex-col gap-1">
            {missingCertificate.slice(0, 4).map((property) => (
              <li key={property.reference}>
                <Link
                  href={`/admin/imoveis/${property.reference}/editar`}
                  className="text-sm text-foreground-muted hover:text-accent transition-colors"
                >
                  {property.title}
                </Link>
              </li>
            ))}
            {missingCertificate.length > 4 && (
              <li className="text-xs text-foreground-muted">e mais {missingCertificate.length - 4}…</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
