import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllPropertiesForAdmin } from "@/lib/admin-properties";
import { getLeadStats } from "@/lib/admin-analytics";
import { PublishToggleBadge } from "./PublishToggleBadge";
import { FeaturedToggleBadge } from "./FeaturedToggleBadge";
import { DuplicateButton } from "./DuplicateButton";
import { AdminSummary } from "./AdminSummary";

const STATUS_LABEL: Record<string, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  off_market: "Off-Market",
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [properties, leadStats] = await Promise.all([getAllPropertiesForAdmin(), getLeadStats()]);
  const missingCertificate = properties
    .filter((property) => !property.is_campaign_page && property.published && !property.energy_certificate)
    .map((property) => ({ reference: property.reference, title: property.title }));

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-2xl mb-6">Imóveis</h1>
        <AdminSummary leadsLast7Days={leadStats.last7Days} missingCertificate={missingCertificate} />

        {properties.length === 0 ? (
          <p className="text-foreground-muted">Nenhum imóvel cadastrado ainda.</p>
        ) : (
          <div className="border border-border">
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 last:border-b-0 transition-colors hover:bg-background-raised"
              >
                <Link href={`/admin/imoveis/${property.reference}/editar`} className="min-w-0 max-w-[46%] shrink">
                  <p className="font-display text-base truncate">{property.title}</p>
                  <p className="text-xs text-foreground-muted mt-0.5 truncate">
                    {property.reference} · {property.zone}
                  </p>
                </Link>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-foreground-muted whitespace-nowrap">{STATUS_LABEL[property.status] ?? property.status}</span>
                  {property.business_type === "arrendamento" && (
                    <span className="text-[10px] tracking-[0.06em] uppercase text-foreground-muted border border-border px-1.5 py-0.5">
                      Arrendamento
                    </span>
                  )}
                  <FeaturedToggleBadge
                    propertyId={property.id}
                    reference={property.reference}
                    campaignPath={property.is_campaign_page ? property.campaign_path : null}
                    initialFeatured={property.featured}
                  />
                  <PublishToggleBadge
                    propertyId={property.id}
                    reference={property.reference}
                    campaignPath={property.is_campaign_page ? property.campaign_path : null}
                    initialPublished={property.published}
                  />
                  <DuplicateButton propertyId={property.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
