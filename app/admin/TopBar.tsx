import { LogoutButton } from "./LogoutButton";
import { ThemeToggle } from "@/app/components/ThemeToggle";

// Fixo no canto superior direito, fora do fluxo de rolagem da sidebar e do
// conteúdo — sempre visível, em qualquer página do admin.
export function TopBar() {
  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
      <ThemeToggle />
      <LogoutButton />
    </div>
  );
}
