import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ShortcutsEditor } from "./ShortcutsEditor";

export default async function AtalhosPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl mb-2">Atalhos de teclado</h1>
        <p className="text-sm text-foreground-muted mb-8">
          <span className="text-accent">Cmd/Ctrl + K</span> abre a busca rápida a qualquer momento. As teclas abaixo
          navegam direto, sem abrir a busca — clique em &ldquo;Editar&rdquo; e prima a tecla (ou duas em sequência) que quiser
          usar. Só funcionam fora de campos de texto.
        </p>
        <ShortcutsEditor />
      </div>
    </main>
  );
}
