import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

// A sidebar só aparece pra sessão autenticada — a página de login (e o
// instante antes de cada página protegida redirecionar) renderiza sem
// nenhum chrome ao redor.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
