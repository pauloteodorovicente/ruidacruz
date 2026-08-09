"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminBrand } from "./AdminBrand";

const NAV_ITEMS = [
  { href: "/admin", label: "Imóveis" },
  { href: "/admin/imoveis/novo", label: "+ Novo Imóvel" },
  { href: "/admin/hero", label: "Hero da Home" },
  { href: "/admin/depoimentos", label: "Depoimentos" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/integracoes", label: "Integrações" },
  { href: "/admin/atalhos", label: "Atalhos" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-44 sm:w-52 shrink-0 flex-col justify-between overflow-y-auto border-r border-border bg-background-raised px-4 py-8">
      <div>
        <div className="mb-8 px-1">
          <AdminBrand />
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs tracking-[0.08em] uppercase px-3 py-2 transition-colors ${
                  active ? "text-accent bg-accent/10" : "text-foreground-muted hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs tracking-[0.08em] uppercase text-foreground-muted hover:text-accent transition-colors px-3 pt-6 border-t border-border"
      >
        Ver Site ↗
      </Link>
    </aside>
  );
}
