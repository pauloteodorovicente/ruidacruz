import { redirect, notFound } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getTestimonialByIdForAdmin } from "@/lib/admin-testimonials";
import { TestimonialForm } from "../../../TestimonialForm";

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
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-1">Painel Administrativo</p>
        <h1 className="font-display text-2xl mb-10">Editar Depoimento</h1>
        <TestimonialForm testimonial={testimonial} />
      </div>
    </main>
  );
}
