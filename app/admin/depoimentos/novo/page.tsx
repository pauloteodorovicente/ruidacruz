import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { TestimonialForm } from "../../TestimonialForm";

export default async function NewTestimonialPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl mb-10">Novo Depoimento</h1>
        <TestimonialForm />
      </div>
    </main>
  );
}
