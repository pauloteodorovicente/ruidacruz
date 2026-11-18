import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getInstagramSettingsForAdmin } from "@/lib/settings";
import { getInstagramPostsForAdmin } from "@/lib/instagram-posts";
import { InstagramManager } from "./InstagramManager";

export default async function InstagramAdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [settings, posts] = await Promise.all([getInstagramSettingsForAdmin(), getInstagramPostsForAdmin()]);

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl mb-2">Instagram na Home</h1>
        <p className="text-sm text-foreground-muted mb-10">
          Uma seção “No Instagram” na Home com as publicações que você escolher, sem precisar de nenhuma conexão com o
          Instagram: você manda a imagem e cola o link do post. Quem clica abre a publicação no Instagram.
        </p>
        <InstagramManager initialSettings={settings} initialPosts={posts} />
      </div>
    </main>
  );
}
