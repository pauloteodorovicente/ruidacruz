import { createClient } from "@/lib/supabase/server";

export type Testimonial = {
  id: string;
  author_name: string;
  quote: string;
  rating: number | null;
  source: string | null;
  featured: boolean;
  created_at: string;
};

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
