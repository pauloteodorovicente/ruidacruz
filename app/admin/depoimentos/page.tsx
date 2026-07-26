import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllTestimonialsForAdmin } from "@/lib/admin-testimonials";
import { deleteTestimonial } from "../testimonial-actions";

export default async function TestimonialsAdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const testimonials = await getAllTestimonialsForAdmin();

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-y-3 mb-10">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-1">Painel Administrativo</p>
            <h1 className="font-display text-2xl">Depoimentos</h1>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/admin/depoimentos/novo" className="text-xs tracking-[0.08em] uppercase text-accent hover:text-accent-strong transition-colors">
              + Novo Depoimento
            </Link>
            <Link href="/admin" className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors">
              ← Imóveis
            </Link>
          </div>
        </div>

        {testimonials.length === 0 ? (
          <p className="text-foreground-muted">Nenhum depoimento ainda.</p>
        ) : (
          <div className="border border-border">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-5 py-4 last:border-b-0">
                <div className="max-w-lg">
                  <p className="font-display text-base">{testimonial.author_name}</p>
                  <p className="text-sm text-foreground-muted mt-1 line-clamp-2">{testimonial.quote}</p>
                  {!testimonial.featured && (
                    <span className="mt-2 inline-block text-[11px] tracking-[0.08em] uppercase text-accent border border-accent px-2 py-0.5">
                      Oculto
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <Link
                    href={`/admin/depoimentos/${testimonial.id}/editar`}
                    className="text-xs tracking-[0.08em] uppercase text-accent hover:text-accent-strong transition-colors"
                  >
                    Editar
                  </Link>
                  <form action={deleteTestimonial.bind(null, testimonial.id)}>
                    <button type="submit" className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors">
                      Remover
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
