import Link from "next/link";

export function AdminBrand() {
  return (
    <Link
      href="/admin"
      className="text-xs tracking-[0.25em] uppercase text-accent hover:text-accent-strong transition-colors mb-1 inline-block"
    >
      Painel Administrativo
    </Link>
  );
}
