import { isAdminAuthenticated } from "@/lib/admin-auth";
import { RootShell } from "@/app/components/site/RootShell";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "./CommandPalette";

// A sidebar só aparece pra sessão autenticada — a página de login (e o
// instante antes de cada página protegida redirecionar) renderiza sem
// nenhum chrome ao redor. O painel é interno e só em português, então gera o
// próprio <html lang="pt-PT"> (ver RootShell).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) return <RootShell lang="pt-PT">{children}</RootShell>;

  return (
    <RootShell lang="pt-PT">
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <TopBar />
        <CommandPalette />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </RootShell>
  );
}
