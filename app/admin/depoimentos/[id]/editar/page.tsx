import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getTestimonialByIdForAdmin } from "@/lib/admin-testimonials";
import { TestimonialForm } from "../../../TestimonialForm";
import { AdminBrand } from "../../../AdminBrand";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const testimonial = await getTestimonialByIdForAdmin(id);
  if (!testimonial) notFound();

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-y-3 mb-10">
          <div>
            <AdminBrand />
            <h1 className="font-display text-2xl">Editar Depoimento</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/admin/depoimentos" className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors">
              ← Depoimentos
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <TestimonialForm testimonial={testimonial} />
      </div>
    </main>
  );
}
