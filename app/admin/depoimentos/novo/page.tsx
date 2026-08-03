import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { TestimonialForm } from "../../TestimonialForm";
import { AdminBrand } from "../../AdminBrand";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default async function NewTestimonialPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-y-3 mb-10">
          <div>
            <AdminBrand />
            <h1 className="font-display text-2xl">Novo Depoimento</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/admin/depoimentos" className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors">
              ← Depoimentos
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <TestimonialForm />
      </div>
    </main>
  );
}
