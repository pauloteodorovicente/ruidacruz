import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { InstagramPost } from "@/lib/instagram";

// Posts visíveis, na ordem do admin (a regra de acesso do banco já esconde os ocultos do visitante).
export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("instagram_posts")
    .select("*")
    .eq("visible", true)
    .order("position", { ascending: true });
  // A seção é um extra da Home: se a leitura falhar, some em vez de derrubar a página inteira.
  if (error) return [];
  return (data ?? []) as InstagramPost[];
}

// Painel: todos os posts, inclusive os ocultos.
export async function getInstagramPostsForAdmin(): Promise<InstagramPost[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("instagram_posts").select("*").order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as InstagramPost[];
}
