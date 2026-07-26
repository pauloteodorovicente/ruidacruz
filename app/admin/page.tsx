import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllPropertiesForAdmin } from "@/lib/admin-properties";
import { LogoutButton } from "./LogoutButton";

const STATUS_LABEL: Record<string, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  off_market: "Off-Market",
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const properties = await getAllPropertiesForAdmin();

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-1">Painel Administrativo</p>
            <h1 className="font-display text-2xl">Imóveis</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/admin/imoveis/novo" className="text-xs tracking-[0.08em] uppercase text-accent hover:text-accent-strong transition-colors">
              + Novo Imóvel
            </Link>
            <LogoutButton />
          </div>
        </div>

        {properties.length === 0 ? (
          <p className="text-foreground-muted">Nenhum imóvel cadastrado ainda.</p>
        ) : (
          <div className="border border-border">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/admin/imoveis/${property.reference}/editar`}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 last:border-b-0 transition-colors hover:bg-background-raised"
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
                  <span
                    className="text-[11px] tracking-[0.08em] uppercase px-2 py-0.5"
                    style={
                      property.published
                        ? { color: "#3d6b4a", borderColor: "#3d6b4a", border: "1px solid" }
                        : { color: "#a3623a", borderColor: "#a3623a", border: "1px solid" }
                    }
                  >
                    {property.published ? "Publicado" : "Rascunho"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
