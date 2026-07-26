import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProperties } from "@/lib/properties";
import { LogoutButton } from "./LogoutButton";

const STATUS_LABEL: Record<string, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  off_market: "Off-Market",
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const properties = await getProperties();

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-1">Painel Administrativo</p>
            <h1 className="font-display text-2xl">Imóveis</h1>
          </div>
          <LogoutButton />
        </div>

        {properties.length === 0 ? (
          <p className="text-foreground-muted">Nenhum imóvel cadastrado ainda.</p>
        ) : (
          <div className="border border-border">
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 last:border-b-0"
              >
                <div>
                  <p className="font-display text-base">{property.title}</p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    {property.reference} · {property.zone}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-foreground-muted">{STATUS_LABEL[property.status] ?? property.status}</span>
                  {property.featured && (
                    <span className="text-[11px] tracking-[0.08em] uppercase text-accent border border-accent px-2 py-0.5">
                      Destaque
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Próximo output (Fase 6): formulário de criar/editar imóvel — ver Checklist de Construção. */}
      </div>
    </main>
  );
}
