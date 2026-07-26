import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Testimonial } from "@/lib/testimonials";

// Via service role, mesma razão do admin-properties.ts: o gate do painel não
// é uma sessão real do Supabase Auth, então a leitura pública (RLS) esconderia
// os não-destacados até do próprio admin.

export async function getAllTestimonialsForAdmin(): Promise<Testimonial[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getTestimonialByIdForAdmin(id: string): Promise<Testimonial | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return data;
}
