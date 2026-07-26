import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { PropertyForm } from "../../PropertyForm";

export default async function NewPropertyPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-1">Painel Administrativo</p>
        <h1 className="font-display text-2xl mb-10">Novo Imóvel</h1>
        <PropertyForm />
      </div>
    </main>
  );
}
