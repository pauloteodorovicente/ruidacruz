import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server Components só leem cookies; Server Actions/Route Handlers também escrevem
// (renovando o token de sessão). O try/catch cobre o caso de leitura pura.
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase não configurado: faltam NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY nas variáveis de ambiente deste deploy."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Chamado de um Server Component sem permissão de escrita — ok ignorar
          // se houver um middleware renovando a sessão.
        }
      },
    },
  });
}
